"use client";

import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Database,
  FileSearch,
  Gauge,
  History,
  Layers3,
  Loader2,
  MapPin,
  Play,
  RefreshCcw,
  Scale,
  SearchCheck,
  Send,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  UserRoundCheck,
  Users,
  Wand2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type {
  AnalysisResult,
  FirmIntent,
  ObligationCard,
  ObligationState,
  ScenarioEvent,
  ToolCall
} from "@/lib/types";

const DEFAULT_FIRM_ID = "FIRMA-0004";

const moneyFormatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0
});

const dateTimeFormatter = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

const stateLabels: Record<ObligationState, string> = {
  PLATI_NYNI: "Platí nyní",
  VZNIKNE_POZDEJI: "Vznikne později",
  POUZE_MONITORUJEME: "Monitorujeme",
  VYZADUJE_OVERENI: "Ověřit",
  SPLNENO: "Splněno"
};

const toolLabels: Record<ToolCall["name"], string> = {
  get_intent: "Načtení záměru",
  lookup_registry: "Kontrola registru",
  lookup_legislation: "Legislativní pravidlo",
  schedule: "Plánování hlídání",
  validate_output: "Validace výstupu"
};

const toolIcons: Record<ToolCall["name"], LucideIcon> = {
  get_intent: FileSearch,
  lookup_registry: Database,
  lookup_legislation: Scale,
  schedule: CalendarClock,
  validate_output: ShieldCheck
};

type FirmsResponse = {
  firms: FirmIntent[];
};

type ApiError = {
  message?: string;
};

export default function Home() {
  const [firms, setFirms] = useState<FirmIntent[]>([]);
  const [selectedFirmId, setSelectedFirmId] = useState(DEFAULT_FIRM_ID);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [scenarioLabel, setScenarioLabel] = useState("Základní plán");
  const [scenarioText, setScenarioText] = useState("Co když obrat vzroste na 3 miliony?");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);
  const activeRequest = useRef(0);

  useEffect(() => {
    void loadInitialData();
  }, []);

  const visibleFirm = useMemo(
    () => analysis?.firm ?? firms.find((firm) => firm.id === selectedFirmId) ?? null,
    [analysis?.firm, firms, selectedFirmId]
  );

  const resultCounts = useMemo(() => {
    const obligations = analysis?.obligations ?? [];
    const immediate = obligations.filter((item) => item.state === "PLATI_NYNI").length;
    const future = obligations.filter((item) => item.state === "VZNIKNE_POZDEJI").length;
    const monitored = obligations.filter((item) => item.state === "POUZE_MONITORUJEME").length;
    const approval = obligations.filter((item) => item.requiresHumanApproval).length;
    return { immediate, future, monitored, approval };
  }, [analysis?.obligations]);

  const comparison = useMemo(() => {
    const baseline = analysis?.baseline ?? [];
    const radar = analysis?.obligations.map((item) => item.id) ?? [];
    const radarSet = new Set(radar);
    const baselineSet = new Set(baseline);
    return {
      baseline,
      radar,
      addedByRadar: radar.filter((id) => !baselineSet.has(id)),
      baselineOnly: baseline.filter((id) => !radarSet.has(id))
    };
  }, [analysis?.baseline, analysis?.obligations]);

  async function loadInitialData() {
    setLoading(true);
    setError(null);

    try {
      const data = await requestJson<FirmsResponse>("/api/firms");
      setFirms(data.firms);
      const defaultId = data.firms.some((firm) => firm.id === DEFAULT_FIRM_ID)
        ? DEFAULT_FIRM_ID
        : data.firms[0]?.id ?? DEFAULT_FIRM_ID;
      setSelectedFirmId(defaultId);
      await loadAnalysis(defaultId, "Základní plán");
    } catch (cause) {
      setError(errorMessage(cause));
      setLoading(false);
    }
  }

  async function loadAnalysis(firmId: string, label: string) {
    const requestId = ++activeRequest.current;
    setLoading(true);
    setError(null);

    try {
      const data = await requestJson<AnalysisResult>("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ firmId })
      });

      if (requestId === activeRequest.current) {
        setAnalysis(data);
        setScenarioLabel(label);
        setApproved(false);
        setApprovedAt(null);
      }
    } catch (cause) {
      if (requestId === activeRequest.current) {
        setError(errorMessage(cause));
      }
    } finally {
      if (requestId === activeRequest.current) {
        setLoading(false);
      }
    }
  }

  async function runScenario(event: ScenarioEvent, label: string) {
    const requestId = ++activeRequest.current;
    setLoading(true);
    setError(null);

    try {
      const data = await requestJson<AnalysisResult>("/api/simulate", {
        method: "POST",
        body: JSON.stringify({ firmId: selectedFirmId, event })
      });

      if (requestId === activeRequest.current) {
        setAnalysis(data);
        setScenarioLabel(label);
        setApproved(false);
        setApprovedAt(null);
      }
    } catch (cause) {
      if (requestId === activeRequest.current) {
        setError(errorMessage(cause));
      }
    } finally {
      if (requestId === activeRequest.current) {
        setLoading(false);
      }
    }
  }

  async function runScenarioQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = scenarioText.trim();
    if (!text) return;

    const requestId = ++activeRequest.current;
    setLoading(true);
    setError(null);

    try {
      const data = await requestJson<AnalysisResult>("/api/simulate", {
        method: "POST",
        body: JSON.stringify({ firmId: selectedFirmId, text })
      });

      if (requestId === activeRequest.current) {
        setAnalysis(data);
        setScenarioLabel(`What-if: ${text.length > 34 ? `${text.slice(0, 31)}...` : text}`);
        setApproved(false);
        setApprovedAt(null);
      }
    } catch (cause) {
      if (requestId === activeRequest.current) {
        setError(errorMessage(cause));
      }
    } finally {
      if (requestId === activeRequest.current) {
        setLoading(false);
      }
    }
  }

  function handleFirmChange(firmId: string) {
    setSelectedFirmId(firmId);
    void loadAnalysis(firmId, "Základní plán");
  }

  function handleApprove() {
    setApproved(true);
    setApprovedAt(dateTimeFormatter.format(new Date()));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup" aria-label="YearOne">
          <div className="brand-mark">
            <SearchCheck size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">YearOne</p>
            <h1>AI plánovač prvního roku firmy</h1>
          </div>
        </div>
        <div className="topbar-status">
          <span className="status-pill">
            {loading ? <Loader2 className="spin" size={15} aria-hidden="true" /> : <CircleDot size={15} aria-hidden="true" />}
            {loading ? "Přepočítávám" : scenarioLabel}
          </span>
          <span className="status-pill muted">
            <Gauge size={15} aria-hidden="true" />
            {analysis?.model.mode ?? "local"} režim
          </span>
        </div>
      </header>

      {error ? (
        <section className="error-panel" role="alert">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>{error}</span>
        </section>
      ) : null}

      <section className="dashboard-grid" aria-label="YearOne dashboard">
        <aside className="panel profile-panel">
          <PanelTitle icon={Building2} title="Guidance Canvas" detail="Model firmy pro první rok" />

          <label className="field-label" htmlFor="firm-select">
            Vybraný záměr
          </label>
          <select id="firm-select" value={selectedFirmId} onChange={(event) => handleFirmChange(event.target.value)}>
            {firms.map((firm) => (
              <option key={firm.id} value={firm.id}>
                {firm.id} - {firm.nazev}
              </option>
            ))}
          </select>

          <div className="firm-list" aria-label="Rychly vyber firmy">
            {firms.slice(0, 12).map((firm) => (
              <button
                className={firm.id === selectedFirmId ? "firm-option active" : "firm-option"}
                key={firm.id}
                type="button"
                onClick={() => handleFirmChange(firm.id)}
              >
                <span>{firm.id}</span>
                <strong>{firm.predmet}</strong>
              </button>
            ))}
          </div>

          {visibleFirm ? (
            <div className="profile-facts">
              <Fact label="Nazev" value={visibleFirm.nazev} />
              <Fact label="Předmět" value={visibleFirm.predmet} />
              <Fact label="Sídlo" value={visibleFirm.sidlo.adresa} />
              <Fact label="Obrat" value={moneyFormatter.format(visibleFirm.predpokladany_obrat_rok)} />
              <Fact label="Zamestnanci" value={`${visibleFirm.plan_zamestnancu}`} />
              <Fact label="Provozovna" value={visibleFirm.provozovna?.adresa ?? "Neuvedena"} />
            </div>
          ) : (
            <div className="empty-state">Cekam na seznam firem.</div>
          )}

          {visibleFirm ? (
            <div className="partner-box">
              <div className="mini-heading">
                <Users size={15} aria-hidden="true" />
                Společníci
              </div>
              {visibleFirm.spolecnici.map((partner, index) => (
                <div className="partner-row" key={`${partner.typ}-${partner.ico ?? partner.statni_prislusnost ?? index}`}>
                  <span>{partner.typ}</span>
                  <strong>{partner.nazev ?? partner.statni_prislusnost ?? "neuvedeno"}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </aside>

        <section className="panel tool-panel">
          <div className="tool-panel-head">
            <PanelTitle icon={Layers3} title="Agentní plánovač" detail="Registry, pravidla, timeline" />
            <div className="action-row" aria-label="Scenare">
              <button
                className="action-button accent"
                type="button"
                disabled={loading}
                onClick={() =>
                  runScenario(
                    {
                      type: "employee_start",
                      text: "Co kdyz zamestnanec nastoupi 15. zari?",
                      employeeStartDate: "15. září"
                    },
                    "Zaměstnanec 15. září"
                  )
                }
              >
                <Wand2 size={16} aria-hidden="true" />
                Co když zaměstnanec nastoupí 15. září?
              </button>
              <button
                className="action-button warn"
                type="button"
                disabled={loading}
                onClick={() =>
                  runScenario(
                    {
                      type: "advance_time",
                      text: "Posunout firmu o 6 mesicu",
                      months: 6
                    },
                    "Posun o 6 měsíců"
                  )
                }
              >
                <History size={16} aria-hidden="true" />
                Posunout firmu o 6 měsíců
              </button>
              <button
                className="icon-text-button"
                type="button"
                disabled={loading}
                onClick={() => void loadAnalysis(selectedFirmId, "Základní plán")}
              >
                <RefreshCcw size={16} aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>

          <div className="narration-box">
            <div className="mini-heading">
              <ClipboardCheck size={15} aria-hidden="true" />
              Agentní závěr
            </div>
            <p>{analysis?.model.narration ?? "Analyza se nacte po vyberu firmy."}</p>
            <span>{analysis?.model.message ?? "Cekam na odpoved backendu."}</span>
          </div>

          <div className="what-if-workbench" aria-label="What-if simulátor">
            <div className="mini-heading">
              <Wand2 size={15} aria-hidden="true" />
              What-if simulátor prvního roku
            </div>
            <div className="scenario-button-grid">
              <button
                className="scenario-button"
                type="button"
                disabled={loading}
                onClick={() =>
                  runScenario(
                    {
                      type: "increase_turnover",
                      text: "Co když obrat vzroste na 3 miliony?",
                      turnover: 3_000_000
                    },
                    "DPH limit"
                  )
                }
              >
                <TrendingUp size={15} aria-hidden="true" />
                Překročím DPH limit
              </button>
              <button
                className="scenario-button"
                type="button"
                disabled={loading}
                onClick={() =>
                  runScenario(
                    {
                      type: "open_branch",
                      text: "Co když otevřu pobočku v Brně?",
                      address: "Pobočka Brno"
                    },
                    "Provozovna Brno"
                  )
                }
              >
                <MapPin size={15} aria-hidden="true" />
                Otevřu provozovnu
              </button>
              <button
                className="scenario-button"
                type="button"
                disabled={loading}
                onClick={() =>
                  runScenario(
                    {
                      type: "add_regulated_trade",
                      text: "Co když přidám realitní zprostředkování?",
                      subject: "Realitni zprostredkovani"
                    },
                    "Regulovaná živnost"
                  )
                }
              >
                <Scale size={15} aria-hidden="true" />
                Přidám regulovanou živnost
              </button>
              <button
                className="scenario-button"
                type="button"
                disabled={loading}
                onClick={() =>
                  runScenario(
                    {
                      type: "add_partner",
                      text: "Co když přidám společníka?",
                      partner: { typ: "FO", statni_prislusnost: "CZ" }
                    },
                    "Nový společník"
                  )
                }
              >
                <UserPlus size={15} aria-hidden="true" />
                Přidám společníka
              </button>
            </div>
            <form className="scenario-form" onSubmit={runScenarioQuestion}>
              <input
                aria-label="Volná what-if otázka"
                disabled={loading}
                value={scenarioText}
                onChange={(event) => setScenarioText(event.target.value)}
                placeholder="Co když otevřu pobočku v Brně?"
              />
              <button className="icon-text-button" type="submit" disabled={loading || !scenarioText.trim()}>
                <Send size={15} aria-hidden="true" />
                Simulovat
              </button>
            </form>
          </div>

          <div className="tool-call-list" aria-label="Agentni volani nastroju">
            {(analysis?.toolCalls ?? []).map((call) => (
              <ToolCallRow call={call} key={call.id} />
            ))}
            {!analysis?.toolCalls.length ? <div className="empty-state">Zatim nejsou dostupna zadna volani.</div> : null}
          </div>
        </section>

        <aside className="panel result-panel">
          <PanelTitle icon={BadgeCheck} title="Výsledek plánu" detail="Počty a lidské schválení" />

          <div className="stat-grid">
            <Metric label="Teď" value={resultCounts.immediate} tone="green" />
            <Metric label="Brzy" value={resultCounts.future} tone="amber" />
            <Metric label="Chybí data" value={analysis?.missingData ?? 0} tone="blue" />
            <Metric label="Dotazy" value={analysis?.founderBurden ?? 0} tone="blue" />
            <Metric label="Ke schválení" value={resultCounts.approval} tone="red" />
            <Metric label="Povinnosti" value={analysis?.obligations.length ?? 0} tone="blue" />
          </div>

          <div className="approval-box">
            <div>
              <div className="mini-heading">
                {approved ? <CheckCircle2 size={15} aria-hidden="true" /> : <UserRoundCheck size={15} aria-hidden="true" />}
                Lidské schválení
              </div>
              <p>{approved ? `Schvaleno ${approvedAt}` : "Vystup ceka na kontrolu clovekem."}</p>
            </div>
            <button className="approve-button" type="button" disabled={!analysis || loading || approved} onClick={handleApprove}>
              <CheckCircle2 size={16} aria-hidden="true" />
              Approve
            </button>
          </div>

          <div className="score-box">
            <div className="mini-heading">
              <Gauge size={15} aria-hidden="true" />
              Skore sandboxu
            </div>
            <div className="score-row">
              <span>Baseline</span>
              <strong>
                {analysis?.score.baseline.missed ?? 0} missed / {analysis?.score.baseline.extra ?? 0} extra
              </strong>
            </div>
            <div className="score-row">
              <span>YearOne</span>
              <strong>
                {analysis?.score.firmaradar.missed ?? 0} missed / {analysis?.score.firmaradar.extra ?? 0} extra
              </strong>
            </div>
          </div>

          {analysis?.scenario ? (
            <div className="scenario-delta-box">
              <div className="mini-heading">
                <History size={15} aria-hidden="true" />
                Dopad scénáře
              </div>
              <DeltaLine label="Nové" values={analysis.scenario.delta.addedObligations} />
              <DeltaLine label="Odebrané" values={analysis.scenario.delta.removedObligations} />
              <DeltaLine label="Timeline" values={analysis.scenario.delta.timelineImpact} />
              <div className="score-row">
                <span>Složitost</span>
                <strong>{analysis.scenario.delta.administrativeComplexity}</strong>
              </div>
              <p>Scénář je pouze simulace, do plánu se bez schválení neukládá.</p>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="bottom-grid" aria-label="Vysledne artefakty">
        <section className="panel comparison-panel">
          <PanelTitle icon={Scale} title="Baseline vs YearOne" detail={`${analysis?.score.cases ?? 0} testovacich pripadu`} />
          <div className="comparison-grid">
            <ComparisonColumn title="Baseline" ids={comparison.baseline} tone="baseline" />
            <ComparisonColumn title="YearOne" ids={comparison.radar} tone="radar" />
          </div>
          <div className="delta-row">
            <span>
              Pridano agentem: <strong>{comparison.addedByRadar.length}</strong>
            </span>
            <span>
              Jen baseline: <strong>{comparison.baselineOnly.length}</strong>
            </span>
          </div>
        </section>

        <section className="panel obligations-panel">
          <PanelTitle icon={ClipboardCheck} title="Povinnosti" detail="Karty s pravidly a zdroji" />
          <div className="obligation-grid">
            {(analysis?.obligations ?? []).map((obligation) => (
              <ObligationItem obligation={obligation} key={obligation.id} />
            ))}
            {!analysis?.obligations.length ? <div className="empty-state">Povinnosti se zobrazi po analyze.</div> : null}
          </div>
        </section>

        <section className="panel timeline-panel">
          <PanelTitle icon={Clock3} title="Timeline prvního roku" detail="Personalizovaný plán hlídání" />
          <div className="timeline-list">
            {(analysis?.timeline ?? []).map((item) => (
              <article className="timeline-item" key={item.id}>
                <div className={stateClass(item.status)}>
                  <Play size={13} aria-hidden="true" />
                  {stateLabels[item.status]}
                </div>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.reason}</p>
                  <span>{item.authority}</span>
                </div>
                <strong>{item.due}</strong>
              </article>
            ))}
            {!analysis?.timeline.length ? <div className="empty-state">Timeline zatim neni k dispozici.</div> : null}
          </div>
        </section>
      </section>
    </main>
  );
}

function PanelTitle({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="panel-title">
      <div className="panel-icon">
        <Icon size={17} aria-hidden="true" />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "blue" | "green" | "amber" | "red" }) {
  return (
    <div className={`metric metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ToolCallRow({ call }: { call: ToolCall }) {
  const Icon = toolIcons[call.name];

  return (
    <article className="tool-call">
      <div className="tool-icon">
        <Icon size={16} aria-hidden="true" />
      </div>
      <div className="tool-main">
        <div className="tool-heading">
          <h3>{toolLabels[call.name]}</h3>
          <span className={`tool-status status-${call.status}`}>{call.status}</span>
        </div>
        <p>{shortJson(call.input)}</p>
        <code>{shortJson(call.output)}</code>
      </div>
      <span className="tool-time">{call.durationMs} ms</span>
    </article>
  );
}

function ComparisonColumn({ title, ids, tone }: { title: string; ids: string[]; tone: "baseline" | "radar" }) {
  return (
    <div className={`comparison-column ${tone}`}>
      <div className="comparison-head">
        <span>{title}</span>
        <strong>{ids.length}</strong>
      </div>
      <div className="chip-list">
        {ids.map((id) => (
          <span className="chip" key={`${title}-${id}`}>
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}

function DeltaLine({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="delta-line">
      <span>{label}</span>
      <div className="chip-list">
        {values.length ? (
          values.map((value) => (
            <span className="chip" key={`${label}-${value}`}>
              {value}
            </span>
          ))
        ) : (
          <span className="chip muted-chip">žádné</span>
        )}
      </div>
    </div>
  );
}

function ObligationItem({ obligation }: { obligation: ObligationCard }) {
  return (
    <article className="obligation-card">
      <div className="obligation-head">
        <div>
          <span>{obligation.id}</span>
          <h3>{obligation.label}</h3>
        </div>
        <div className={stateClass(obligation.state)}>{stateLabels[obligation.state]}</div>
      </div>
      <p>{obligation.whyApplies}</p>
      <div className="obligation-meta">
        <span>{obligation.action}</span>
        <span>{obligation.dataSource}</span>
        <span>{obligation.ruleSource}</span>
      </div>
    </article>
  );
}

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    let details: ApiError | null = null;
    try {
      details = (await response.json()) as ApiError;
    } catch {
      details = null;
    }
    throw new Error(details?.message ?? `${url} vratilo ${response.status}`);
  }

  return (await response.json()) as T;
}

function shortJson(value: unknown): string {
  if (value === null || value === undefined) return "null";

  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (!text) return "";
  return text.length > 128 ? `${text.slice(0, 125)}...` : text;
}

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : "Nepodarilo se nacist analyzu.";
}

function stateClass(state: ObligationState): string {
  return `state-badge state-${state.toLowerCase()}`;
}
