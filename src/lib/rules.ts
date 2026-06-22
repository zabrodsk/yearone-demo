import type { FirmIntent, ObligationCard, ObligationId, ObligationState, TimelineItem, TradeType } from "./types";
import { allValidObligationIds, getObligationCatalog, lookupLegislation, lookupRegistry } from "./sandbox";

export const DPH_THRESHOLD_CZK = 2_000_000;

const baseObligations: ObligationId[] = [
  "OR_ZAPIS",
  "DPPO",
  "DATOVKA",
  "SIDLO_OZNACENI",
  "SKUTECNI_MAJITELE"
];

const tradeMap: Record<TradeType, ObligationId> = {
  volna: "ZIVNOST_VOLNA",
  vazana: "ZIVNOST_VAZANA",
  koncese: "ZIVNOST_KONCESE"
};

const authorities: Record<ObligationId, string> = {
  OR_ZAPIS: "Rejstrikovy soud",
  DPPO: "Financni sprava",
  DATOVKA: "Ministerstvo vnitra",
  ZIVNOST_VOLNA: "Zivnostensky urad",
  ZIVNOST_VAZANA: "Zivnostensky urad",
  ZIVNOST_KONCESE: "Zivnostensky urad",
  SIDLO_OZNACENI: "Obecny dohled / mistni urady",
  SKUTECNI_MAJITELE: "Evidence skutecnych majitelu",
  DPH: "Financni sprava",
  ZAM_CSSZ: "CSSZ",
  ZAM_ZP: "Zdravotni pojistovna",
  PROVOZOVNA: "Zivnostensky urad"
};

const ruleSources: Record<ObligationId, string> = {
  OR_ZAPIS: "katalog povinnosti: zalozeni s.r.o.",
  DPPO: "katalog povinnosti: dan z prijmu pravnickych osob",
  DATOVKA: "katalog povinnosti: datova schranka",
  ZIVNOST_VOLNA: "registr zivnosti: volna zivnost",
  ZIVNOST_VAZANA: "registr zivnosti: vazana zivnost",
  ZIVNOST_KONCESE: "registr zivnosti: koncese",
  SIDLO_OZNACENI: "katalog povinnosti: oznaceni sidla",
  SKUTECNI_MAJITELE: "katalog povinnosti: evidence skutecnych majitelu",
  DPH: `verzovane pravidlo dph-threshold-v1: obrat > ${DPH_THRESHOLD_CZK.toLocaleString("cs-CZ")} Kc`,
  ZAM_CSSZ: "katalog povinnosti: prvni zamestnanec",
  ZAM_ZP: "katalog povinnosti: prvni zamestnanec",
  PROVOZOVNA: "katalog povinnosti: provozovna"
};

export interface RuleEvaluation {
  obligationIds: ObligationId[];
  obligationCards: ObligationCard[];
  timeline: TimelineItem[];
}

export function evaluateRules(firm: FirmIntent): RuleEvaluation {
  const catalog = getObligationCatalog();
  const ids = new Set<ObligationId>(baseObligations);

  const tradeResult = lookupRegistry("zivnost", firm.predmet);
  if (!tradeResult) {
    throw new Error(`Missing trade classification for: ${firm.predmet}`);
  }

  ids.add(tradeMap[tradeResult.typ_zivnosti]);

  if (firm.provozovna) {
    ids.add("PROVOZOVNA");
  }

  if (firm.plan_zamestnancu > 0) {
    ids.add("ZAM_CSSZ");
    ids.add("ZAM_ZP");
  }

  if (firm.predpokladany_obrat_rok > DPH_THRESHOLD_CZK) {
    ids.add("DPH");
  }

  const sortedIds = sortObligations([...ids]);
  validateObligationIds(sortedIds);

  return {
    obligationIds: sortedIds,
    obligationCards: sortedIds.map((id) => buildObligationCard(id, firm, catalog[id])),
    timeline: buildTimeline(sortedIds, firm, catalog)
  };
}

export function sortObligations(ids: ObligationId[]): ObligationId[] {
  const order: ObligationId[] = [
    "OR_ZAPIS",
    "DPPO",
    "DATOVKA",
    "ZIVNOST_VOLNA",
    "ZIVNOST_VAZANA",
    "ZIVNOST_KONCESE",
    "SIDLO_OZNACENI",
    "SKUTECNI_MAJITELE",
    "PROVOZOVNA",
    "DPH",
    "ZAM_CSSZ",
    "ZAM_ZP"
  ];

  return [...ids].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

export function validateObligationIds(ids: ObligationId[]): void {
  const valid = allValidObligationIds();
  const invalid = ids.filter((id) => !valid.has(id));
  if (invalid.length > 0) {
    throw new Error(`Invalid obligation id(s): ${invalid.join(", ")}`);
  }
}

function buildObligationCard(id: ObligationId, firm: FirmIntent, label: string): ObligationCard {
  return {
    id,
    label,
    state: getState(id),
    trigger: getTrigger(id, firm),
    dataSource: getDataSource(id),
    ruleSource: ruleSources[id],
    whyApplies: explainWhy(id, firm),
    confidence: "vysoka",
    action: getAction(id),
    requiresHumanApproval: true
  };
}

function getState(id: ObligationId): ObligationState {
  if (id === "DPH" || id === "ZAM_CSSZ" || id === "ZAM_ZP") {
    return "VZNIKNE_POZDEJI";
  }
  return "PLATI_NYNI";
}

function getTrigger(id: ObligationId, firm: FirmIntent): string {
  if (id === "DPH") return `predpokladany rocni obrat ${firm.predpokladany_obrat_rok.toLocaleString("cs-CZ")} Kc`;
  if (id === "ZAM_CSSZ" || id === "ZAM_ZP") return `planovany pocet zamestnancu: ${firm.plan_zamestnancu}`;
  if (id === "PROVOZOVNA") return "firma uvadi provozovnu";
  if (id.startsWith("ZIVNOST")) return `predmet podnikani: ${firm.predmet}`;
  return "zalozeni s.r.o.";
}

function getDataSource(id: ObligationId): string {
  if (id.startsWith("ZIVNOST")) return "lookup_registry:zivnost";
  if (id === "DPH") return "zamer firmy + lookup_legislation:dph";
  if (id === "ZAM_CSSZ" || id === "ZAM_ZP") return "zamer firmy + lookup_legislation:zamestnavatel";
  return "zamer firmy + katalog povinnosti";
}

function explainWhy(id: ObligationId, firm: FirmIntent): string {
  switch (id) {
    case "OR_ZAPIS":
      return `${firm.forma} musi vzniknout zapisem do obchodniho rejstriku.`;
    case "DPPO":
      return "Pravnicka osoba bude registrovana k dani z prijmu.";
    case "DATOVKA":
      return "S.r.o. ma datovou schranku zrizovanou automaticky.";
    case "SIDLO_OZNACENI":
      return `Sidlo na adrese ${firm.sidlo.adresa} musi byt oznacene.`;
    case "SKUTECNI_MAJITELE":
      return "Evidence skutecnych majitelu se tyka kazde s.r.o.";
    case "ZIVNOST_VOLNA":
      return `${firm.predmet} je v sandbox registru vedene jako volna zivnost.`;
    case "ZIVNOST_VAZANA":
      return `${firm.predmet} je v sandbox registru vedene jako vazana zivnost.`;
    case "ZIVNOST_KONCESE":
      return `${firm.predmet} je v sandbox registru vedene jako koncese.`;
    case "PROVOZOVNA":
      return `Firma uvadi provozovnu ${firm.provozovna?.adresa ?? ""}.`;
    case "DPH":
      return `Obrat ${firm.predpokladany_obrat_rok.toLocaleString("cs-CZ")} Kc prekroci konfigurovany prah.`;
    case "ZAM_CSSZ":
    case "ZAM_ZP":
      return `Firma planuje ${firm.plan_zamestnancu} zamestnance.`;
  }
}

function getAction(id: ObligationId): string {
  if (id === "DPH") return "hlidat obrat a pripravit registraci";
  if (id === "ZAM_CSSZ" || id === "ZAM_ZP") return "pripravit zamestnavatelske registrace";
  if (id === "ZIVNOST_VAZANA" || id === "ZIVNOST_KONCESE") return "overit odbornou zpusobilost";
  return "pripravit podklady";
}

function buildTimeline(ids: ObligationId[], firm: FirmIntent, catalog: Record<ObligationId, string>): TimelineItem[] {
  const timeline: TimelineItem[] = [];
  const nowIds = ids.filter((id) => getState(id) === "PLATI_NYNI");

  for (const id of nowIds) {
    timeline.push({
      id: `${firm.id}-${id}-now`,
      obligationId: id,
      label: catalog[id],
      status: "PLATI_NYNI",
      due: "pri zalozeni",
      authority: authorities[id],
      reason: getTrigger(id, firm),
      automaticPreparation: "vyplnit navrh podkladu"
    });
  }

  if (ids.includes("DPH")) {
    const law = lookupLegislation("dph");
    timeline.push({
      id: `${firm.id}-DPH-watch`,
      obligationId: "DPH",
      label: catalog.DPH,
      status: "VZNIKNE_POZDEJI",
      due: "pri prekroceni obratu",
      authority: authorities.DPH,
      reason: law.note,
      automaticPreparation: "hlidat obrat a pripravit registraci"
    });
  }

  if (ids.includes("ZAM_CSSZ")) {
    timeline.push({
      id: `${firm.id}-EMPLOYER-watch`,
      obligationId: "ZAM_CSSZ",
      label: "Registrace zamestnavatele",
      status: "VZNIKNE_POZDEJI",
      due: "pred nastupem prvniho zamestnance",
      authority: "CSSZ + zdravotni pojistovna",
      reason: `plan zamestnancu: ${firm.plan_zamestnancu}`,
      automaticPreparation: "pripravit prihlasovaci udaje"
    });
  }

  return timeline;
}
