import type { AnalysisResult, FirmIntent, ObligationId, Partner, ScenarioDelta, ScenarioEvent, TimelineItem, ToolCall } from "./types";
import { getIntent, getObligationCatalog, getPublicCases, lookupLegislation, lookupRegistry } from "./sandbox";
import { evaluateRules, validateObligationIds } from "./rules";
import { calculateScore } from "./score";
import { buildLiveModelStatus, buildModelStatus } from "./model";

export function analyzeFirm(firmId: string, scenario?: ScenarioEvent): AnalysisResult {
  const toolCalls: ToolCall[] = [];

  const firm = measureTool(toolCalls, "get_intent", { firmId }, () => getIntent(firmId));
  const scenarioFirm = applyScenario(firm, scenario);

  const trade = measureTool(toolCalls, "lookup_registry", { type: "zivnost", key: scenarioFirm.predmet }, () =>
    lookupRegistry("zivnost", scenarioFirm.predmet)
  );

  for (const partner of scenarioFirm.spolecnici.filter((item) => item.typ === "PO" && item.ico)) {
    measureTool(toolCalls, "lookup_registry", { type: "ares", key: partner.ico }, () => lookupRegistry("ares", partner.ico ?? ""));
  }

  measureTool(toolCalls, "lookup_legislation", { topic: "zivnost" }, () => lookupLegislation("zivnost"));
  if (scenarioFirm.predpokladany_obrat_rok > 2_000_000) {
    measureTool(toolCalls, "lookup_legislation", { topic: "dph" }, () => lookupLegislation("dph"));
  }
  if (scenarioFirm.plan_zamestnancu > 0) {
    measureTool(toolCalls, "lookup_legislation", { topic: "zamestnavatel" }, () => lookupLegislation("zamestnavatel"));
  }

  const evaluation = evaluateRules(scenarioFirm);

  for (const item of evaluation.timeline.filter((entry) => entry.status === "VZNIKNE_POZDEJI")) {
    measureTool(toolCalls, "schedule", { firmId, obligation: item.obligationId, due: item.due }, () => ({
      id: firmId,
      naplanovano: item.obligationId,
      termin: item.due
    }));
  }

  measureTool(toolCalls, "validate_output", { obligationIds: evaluation.obligationIds }, () => {
    validateObligationIds(evaluation.obligationIds);
    return { valid: true, allowedCatalogSize: Object.keys(getObligationCatalog()).length, trade };
  });

  const baseline = getBaselineForFirm(firmId);
  const timeline = scenario ? enrichTimelineForScenario(evaluation.timeline, scenarioFirm, scenario) : evaluation.timeline;
  const scenarioResult = scenario ? buildScenarioResult(firm, scenarioFirm, scenario, timeline) : undefined;
  const provisional: Omit<AnalysisResult, "model"> = {
    firm: scenarioFirm,
    obligations: evaluation.obligationCards,
    timeline,
    toolCalls,
    baseline,
    founderBurden: 0,
    missingData: 0,
    score: calculateScore(),
    approved: false,
    scenario: scenarioResult
  };

  return {
    ...provisional,
    model: buildModelStatus(provisional)
  };
}

export function simulateEvent(firmId: string, event: ScenarioEvent): AnalysisResult {
  return analyzeFirm(firmId, event);
}

export function simulateFreeText(firmId: string, text: string): AnalysisResult {
  return simulateEvent(firmId, parseScenarioText(text));
}

export async function analyzeFirmWithModel(firmId: string, scenario?: ScenarioEvent): Promise<AnalysisResult> {
  const result = analyzeFirm(firmId, scenario);
  return {
    ...result,
    model: await buildLiveModelStatus(result)
  };
}

export async function simulateEventWithModel(firmId: string, event: ScenarioEvent): Promise<AnalysisResult> {
  return analyzeFirmWithModel(firmId, event);
}

export async function simulateFreeTextWithModel(firmId: string, text: string): Promise<AnalysisResult> {
  return analyzeFirmWithModel(firmId, parseScenarioText(text));
}

function measureTool<T>(
  calls: ToolCall[],
  name: ToolCall["name"],
  input: Record<string, unknown>,
  fn: () => T
): T {
  const start = performance.now();
  const timestamp = new Date().toISOString();

  try {
    const output = fn();
    calls.push({
      id: `${calls.length + 1}-${name}`,
      name,
      input,
      output,
      status: output === null ? "warn" : "ok",
      durationMs: Math.max(1, Math.round(performance.now() - start)),
      timestamp
    });
    return output;
  } catch (error) {
    calls.push({
      id: `${calls.length + 1}-${name}`,
      name,
      input,
      output: error instanceof Error ? error.message : "unknown error",
      status: "error",
      durationMs: Math.max(1, Math.round(performance.now() - start)),
      timestamp
    });
    throw error;
  }
}

function applyScenario(firm: FirmIntent, scenario?: ScenarioEvent): FirmIntent {
  if (!scenario) return firm;

  if (scenario.type === "increase_turnover" && typeof scenario.turnover === "number") {
    return {
      ...firm,
      predpokladany_obrat_rok: scenario.turnover
    };
  }

  if (scenario.type === "employee_start" && firm.plan_zamestnancu === 0) {
    return {
      ...firm,
      plan_zamestnancu: 1
    };
  }

  if (scenario.type === "employee_start") {
    return {
      ...firm,
      plan_zamestnancu: Math.max(1, firm.plan_zamestnancu)
    };
  }

  if (scenario.type === "open_branch") {
    return {
      ...firm,
      provozovna: {
        adresa: scenario.address ?? "Nova provozovna",
        obec: extractCity(scenario.address)
      }
    };
  }

  if ((scenario.type === "change_subject" || scenario.type === "add_regulated_trade") && scenario.subject) {
    return {
      ...firm,
      predmet: scenario.subject
    };
  }

  if (scenario.type === "add_partner") {
    return {
      ...firm,
      spolecnici: [...firm.spolecnici, scenario.partner ?? defaultPartner()]
    };
  }

  return firm;
}

function enrichTimelineForScenario(timeline: TimelineItem[], firm: FirmIntent, scenario: ScenarioEvent): TimelineItem[] {
  if (scenario.type === "employee_start") {
    const date = scenario.employeeStartDate ?? "15. zari";
    return timeline.map((item) =>
      item.obligationId === "ZAM_CSSZ"
        ? {
            ...item,
            due: date,
            reason: `co kdyz: prvni zamestnanec nastoupi ${date}`
          }
        : item
    );
  }

  if (scenario.type === "advance_time") {
    const months = scenario.months ?? 6;
    return [
      ...timeline,
      {
        id: `${firm.id}-advance-${months}`,
        obligationId: "DPH",
        label: "Kontrola casove osy",
        status: "POUZE_MONITORUJEME",
        due: `za ${months} mesicu`,
        authority: "YearOne",
        reason: "simulace posunu firmy v case",
        automaticPreparation: "znovu prepocitat rizika obratu a zamestnancu"
      }
    ];
  }

  if (scenario.type === "open_branch") {
    return timeline.map((item) =>
      item.obligationId === "PROVOZOVNA"
        ? {
            ...item,
            reason: `co kdyz: firma otevre provozovnu ${scenario.address ?? ""}`.trim()
          }
        : item
    );
  }

  if (scenario.type === "increase_turnover") {
    return timeline.map((item) =>
      item.obligationId === "DPH"
        ? {
            ...item,
            reason: `co kdyz: obrat vzroste na ${(scenario.turnover ?? firm.predpokladany_obrat_rok).toLocaleString("cs-CZ")} Kc`
          }
        : item
    );
  }

  return timeline;
}

export function parseScenarioText(text: string): ScenarioEvent {
  const normalized = normalize(text);
  const parsedFrom = text;

  if (/(brigadnik|zamestnanec|zamestnance|nastoupi|prijmu)/.test(normalized)) {
    return {
      type: "employee_start",
      text,
      employeeStartDate: extractRelativeDate(text) ?? "15. zari",
      parsedFrom
    };
  }

  if (/(pobock|provozovn|branch|brn|praze|ostrave|plzni)/.test(normalized)) {
    return {
      type: "open_branch",
      text,
      address: extractBranchAddress(text),
      parsedFrom
    };
  }

  if (/(obrat|milion|miliony|limit|dph)/.test(normalized)) {
    return {
      type: "increase_turnover",
      text,
      turnover: extractTurnover(text) ?? 3_000_000,
      parsedFrom
    };
  }

  const subject = inferSubject(text);
  if (subject) {
    const regulated = subject !== "Maloobchod a velkoobchod" && subject !== "Vyvoj softwaru a IT sluzby" && subject !== "Marketingove sluzby";
    return {
      type: regulated ? "add_regulated_trade" : "change_subject",
      text,
      subject,
      parsedFrom
    };
  }

  if (/(spolecnik|spolecnika|partner)/.test(normalized)) {
    return {
      type: "add_partner",
      text,
      partner: defaultPartner(),
      parsedFrom
    };
  }

  return {
    type: "advance_time",
    text,
    months: extractMonths(text) ?? 6,
    parsedFrom
  };
}

function buildScenarioResult(originalFirm: FirmIntent, scenarioFirm: FirmIntent, event: ScenarioEvent, timeline: TimelineItem[]) {
  const original = evaluateRules(originalFirm).obligationIds;
  const changed = evaluateRules(scenarioFirm).obligationIds;
  const delta = buildScenarioDelta(original, changed, timeline);

  return {
    event,
    delta,
    persistence: "simulated_only" as const
  };
}

function buildScenarioDelta(original: ObligationId[], changed: ObligationId[], timeline: TimelineItem[]): ScenarioDelta {
  const originalSet = new Set(original);
  const changedSet = new Set(changed);
  const addedObligations = changed.filter((id) => !originalSet.has(id));
  const removedObligations = original.filter((id) => !changedSet.has(id));
  const unchangedObligations = changed.filter((id) => originalSet.has(id));
  const future = timeline
    .filter((item) => item.status === "VZNIKNE_POZDEJI" || item.status === "POUZE_MONITORUJEME")
    .map((item) => `${item.label}: ${item.due}`);

  return {
    addedObligations,
    removedObligations,
    unchangedObligations,
    timelineImpact: future,
    founderQuestionDelta: 0,
    administrativeComplexity: addedObligations.length > removedObligations.length ? "vyssi" : addedObligations.length < removedObligations.length ? "nizsi" : "stejna"
  };
}

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function extractTurnover(text: string): number | undefined {
  const normalized = normalize(text).replace(",", ".");
  const millionMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:milion|miliony|mil\.|mio)/);
  if (millionMatch) return Math.round(Number(millionMatch[1]) * 1_000_000);

  const amountMatch = normalized.match(/(\d[\d\s.]*)\s*(?:kc|czk|korun)?/);
  if (!amountMatch) return undefined;

  const value = Number(amountMatch[1].replace(/\s/g, ""));
  return Number.isFinite(value) ? value : undefined;
}

function extractMonths(text: string): number | undefined {
  const match = normalize(text).match(/za\s+(\d+)\s+mes/);
  return match ? Number(match[1]) : undefined;
}

function extractRelativeDate(text: string): string | undefined {
  const month = extractMonths(text);
  if (month) return `za ${month} mesice`;
  const dateMatch = text.match(/(\d{1,2}\.\s*[^\s,.]+)/);
  return dateMatch?.[1];
}

function extractBranchAddress(text: string): string {
  const normalized = normalize(text);
  if (normalized.includes("brn")) return "Pobocka Brno";
  if (normalized.includes("pra")) return "Pobocka Praha";
  if (normalized.includes("ostr")) return "Pobocka Ostrava";
  if (normalized.includes("plz")) return "Pobocka Plzen";
  return "Nova provozovna";
}

function extractCity(address?: string): string | undefined {
  if (!address) return undefined;
  const parts = address.trim().split(/\s+/);
  return parts.at(-1);
}

function inferSubject(text: string): string | undefined {
  const normalized = normalize(text);
  if (/realit/.test(normalized)) return "Realitni zprostredkovani";
  if (/hostinsk|restaur|hospod/.test(normalized)) return "Hostinska cinnost";
  if (/doprav|naklad/.test(normalized)) return "Silnicni nakladni doprava";
  if (/ucetnict|danov/.test(normalized)) return "Ucetnictvi a danove poradenstvi";
  if (/elektro/.test(normalized)) return "Montaz a opravy elektro";
  if (/stav/.test(normalized)) return "Provadeni staveb";
  if (/software|it/.test(normalized)) return "Vyvoj softwaru a IT sluzby";
  if (/marketing/.test(normalized)) return "Marketingove sluzby";
  return undefined;
}

function defaultPartner(): Partner {
  return {
    typ: "FO",
    statni_prislusnost: "CZ"
  };
}

function getBaselineForFirm(firmId: string): ObligationId[] {
  return getPublicCases().find((item) => item.id === firmId)?.baseline_povinnosti ?? ["DATOVKA", "DPPO", "OR_ZAPIS", "ZIVNOST_VOLNA"];
}
