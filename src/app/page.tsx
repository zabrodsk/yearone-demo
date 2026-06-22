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
  const [completedTimelineIds, setCompletedTimelineIds] = useState<Set<string>>(new Set());
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

  const outputPlan = useMemo(() => buildOutputPlan(analysis), [analysis]);
  const obligationGroups = useMemo(() => groupObligations(analysis?.obligations ?? []), [analysis?.obligations]);

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
        setCompletedTimelineIds(new Set());
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
        setCompletedTimelineIds(new Set());
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
        setCompletedTimelineIds(new Set());
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

  function toggleTimelineItem(id: string) {
    setCompletedTimelineIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup" aria-label="YearOne">
          <div className="brand-mark">
            <img src="/brand/yearone-mark.svg" alt="" />
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

      <section className="demo-strip" aria-label="Demo scénář">
        <div className="demo-step active">
          <span>1</span>
          FIRMA-0004
        </div>
        <div className="demo-step">
          <span>2</span>
          Agent dohledá registry
        </div>
        <div className="demo-step">
          <span>3</span>
          Plán prvního roku
        </div>
        <div className="demo-step">
          <span>4</span>
          What-if zaměstnanec
        </div>
        <div className="demo-step">
          <span>5</span>
          Člověk schválí
        </div>
      </section>

      <section className="plan-hero" aria-label="Plán prvního roku">
        <div>
          <p className="eyebrow accent-eyebrow">Plán prvního roku</p>
          <h2>{visibleFirm?.predmet ?? "Načítám firmu"}</h2>
          <p>
            {visibleFirm
              ? `${visibleFirm.forma} · ${visibleFirm.sidlo.adresa} · obrat ${moneyFormatter.format(visibleFirm.predpokladany_obrat_rok)} · ${visibleFirm.plan_zamestnancu} zaměstnanci`
              : "Agent načítá záměr, registry a pravidla."}
          </p>
        </div>
        <div className="hero-kpis" aria-label="Klíčové metriky">
          <HeroKpi label="Teď" value={resultCounts.immediate} tone="green" />
          <HeroKpi label="Brzy" value={resultCounts.future} tone="amber" />
          <HeroKpi label="Skóre" value={`${analysis?.score.firmaradar.missed ?? 0}/${analysis?.score.firmaradar.extra ?? 0}`} tone="blue" />
        </div>
      </section>

      <section className="panel timeline-axis-panel">
        <div className="timeline-axis-head">
          <PanelTitle icon={Clock3} title="Timeline prvního roku" detail="Kliknutím označíte krok jako hotový" />
          <span className="timeline-progress">
            {completedTimelineIds.size}/{analysis?.timeline.length ?? 0} hotovo
          </span>
        </div>
        <TimelineAxis items={analysis?.timeline ?? []} completedIds={completedTimelineIds} onToggle={toggleTimelineItem} />
        <div className="timeline-legend">
          <span>
            <i className="legend-now" />
            Platí hned
          </span>
          <span>
            <i className="legend-soon" />
            Vznikne později
          </span>
          <span>
            <i className="legend-monitor" />
            Monitorujeme
          </span>
          <span>
            <SearchCheck size={13} aria-hidden="true" />
            Snadno se opomene
          </span>
        </div>
        <div className="plan-footnote">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>YearOne navrhuje a hlídá. Hotové kroky potvrzuje člověk v timeline; výstup je podklad, ne závazná právní rada.</span>
          <strong>{completedTimelineIds.size}/{analysis?.timeline.length ?? 0} potvrzeno</strong>
        </div>
      </section>

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

          <div className="firm-list" aria-label="Rychlý výběr firmy">
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
              <Fact label="Název" value={visibleFirm.nazev} />
              <Fact label="Předmět" value={visibleFirm.predmet} />
              <Fact label="Sídlo" value={visibleFirm.sidlo.adresa} />
              <Fact label="Obrat" value={moneyFormatter.format(visibleFirm.predpokladany_obrat_rok)} />
              <Fact label="Zaměstnanci" value={`${visibleFirm.plan_zamestnancu}`} />
              <Fact label="Provozovna" value={visibleFirm.provozovna?.adresa ?? "Neuvedena"} />
            </div>
          ) : (
            <div className="empty-state">Čekám na seznam firem.</div>
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

          <div className="founder-output">
            <div className="mini-heading">
              <ClipboardCheck size={15} aria-hidden="true" />
              Výstup pro zakladatele
            </div>
            <div className="plain-summary">
              {outputPlan.map((item) => (
                <div className={`summary-step summary-${item.tone}`} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="narration-note">
              <span>{analysis?.model.narration ?? "Analýza se načte po výběru firmy."}</span>
            </div>
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
            <div className="mini-heading">
              <ShieldCheck size={15} aria-hidden="true" />
              Audit agenta
            </div>
            {(analysis?.toolCalls ?? []).map((call) => (
              <ToolCallRow call={call} key={call.id} />
            ))}
            {!analysis?.toolCalls.length ? <div className="empty-state">Zatím nejsou dostupná žádná volání.</div> : null}
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
              <p>{approved ? `Schváleno ${approvedAt}` : "Výstup čeká na kontrolu člověkem."}</p>
            </div>
            <button className="approve-button" type="button" disabled={!analysis || loading || approved} onClick={handleApprove}>
              <CheckCircle2 size={16} aria-hidden="true" />
              Schválit
            </button>
          </div>

          <div className="score-box">
            <div className="mini-heading">
              <Gauge size={15} aria-hidden="true" />
              Skóre sandboxu
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

          <div className="explain-box">
            <div className="mini-heading">
              <Layers3 size={15} aria-hidden="true" />
              Proč je to agent
            </div>
            <div className="explain-list">
              <span>Plánuje kroky</span>
              <span>Volá nástroje</span>
              <span>Dohledává registry</span>
              <span>Odvozuje povinnosti</span>
              <span>Hlídá čas</span>
            </div>
          </div>

          <div className="ethics-box">
            <div className="mini-heading">
              <ShieldCheck size={15} aria-hidden="true" />
              Odpovědnost
            </div>
            <p>Výstup není právní rada. Model nevytváří povinnosti, jen vysvětluje výsledek pravidel.</p>
            <p>Reálné registry by vyžadovaly zákonný titul, souhlas a audit přístupů. Finální krok schvaluje člověk.</p>
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

      <section className="bottom-grid" aria-label="Výsledné artefakty">
        <section className="panel comparison-panel">
          <PanelTitle icon={Scale} title="Baseline vs YearOne" detail={`${analysis?.score.cases ?? 0} testovacích případů`} />
          <div className="comparison-grid">
            <ComparisonColumn title="Baseline" ids={comparison.baseline} tone="baseline" />
            <ComparisonColumn title="YearOne" ids={comparison.radar} tone="radar" />
          </div>
          <div className="delta-row">
            <span>
              Přidáno agentem: <strong>{comparison.addedByRadar.length}</strong>
            </span>
            <span>
              Jen baseline: <strong>{comparison.baselineOnly.length}</strong>
            </span>
          </div>
        </section>

        <section className="panel obligations-panel">
          <PanelTitle icon={ClipboardCheck} title="Plán povinností" detail="Srozumitelně seskupený výstup" />
          <div className="obligation-section-list">
            <ObligationSection title="Teď" obligations={obligationGroups.now} empty="Teď není potřeba přidat další krok." />
            <ObligationSection title="Brzy" obligations={obligationGroups.future} empty="Žádný odložený trigger." />
            <ObligationSection title="Monitorovat" obligations={obligationGroups.monitor} empty="Bez samostatného monitoringu." />
          </div>
        </section>

        <section className="panel agent-sidebar-panel">
          <PanelTitle icon={Wand2} title="YearOne agent" detail="Simulace a otázky k plánu" />
          <div className="agent-message">
            Plán prvního roku je hotový. Vyberte scénář nebo napište vlastní otázku a agent spočítá dopad, než cokoli přidá do plánu.
          </div>
          <div className="agent-prompt-list">
            <button type="button" disabled={loading} onClick={() => runScenario({ type: "employee_start", text: "Co když zaměstnanec nastoupí 15. září?", employeeStartDate: "15. září" }, "Zaměstnanec 15. září")}>
              Zaměstnanec od 15. září
            </button>
            <button type="button" disabled={loading} onClick={() => runScenario({ type: "increase_turnover", text: "Co když obrat vzroste na 3 miliony?", turnover: 3_000_000 }, "DPH limit")}>
              Obrat přes DPH limit
            </button>
            <button type="button" disabled={loading} onClick={() => runScenario({ type: "open_branch", text: "Co když otevřu pobočku v Brně?", address: "Pobočka Brno" }, "Provozovna Brno")}>
              Pobočka v Brně
            </button>
          </div>
          <form className="scenario-form compact" onSubmit={runScenarioQuestion}>
            <input
              aria-label="Volná what-if otázka"
              disabled={loading}
              value={scenarioText}
              onChange={(event) => setScenarioText(event.target.value)}
              placeholder="Zeptejte se na vlastní scénář…"
            />
            <button className="icon-text-button" type="submit" disabled={loading || !scenarioText.trim()}>
              <Send size={15} aria-hidden="true" />
            </button>
          </form>
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

function HeroKpi({ label, value, tone }: { label: string; value: number | string; tone: "blue" | "green" | "amber" }) {
  return (
    <div className={`hero-kpi hero-kpi-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function TimelineAxis({
  items,
  completedIds,
  onToggle
}: {
  items: AnalysisResult["timeline"];
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  if (!items.length) {
    return <div className="empty-state">Timeline zatím není k dispozici.</div>;
  }

  return (
    <div className="timeline-axis-scroll">
      <div className="timeline-axis" style={{ minWidth: Math.max(760, items.length * 168) }}>
        {items.map((item, index) => {
          const completed = completedIds.has(item.id);
          return (
            <article className={`axis-node ${axisStateClass(item.status)} ${completed ? "axis-done" : ""}`} key={item.id}>
              {index > 0 ? <span className="axis-connector" aria-hidden="true" /> : null}
              <span className="axis-date">{item.due}</span>
              <button type="button" className="axis-marker" onClick={() => onToggle(item.id)} aria-label={`Označit ${item.label}`}>
                {completed ? <CheckCircle2 size={17} aria-hidden="true" /> : <span />}
              </button>
              <h3>{item.label}</h3>
              <p>{item.reason}</p>
              <button type="button" className="axis-done-button" onClick={() => onToggle(item.id)}>
                {completed ? "Hotovo" : "Označit hotové"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ObligationSection({ title, obligations, empty }: { title: string; obligations: ObligationCard[]; empty: string }) {
  return (
    <section className="obligation-section">
      <div className="obligation-section-head">
        <h3>{title}</h3>
        <span>{obligations.length}</span>
      </div>
      <div className="obligation-stack">
        {obligations.length ? obligations.map((obligation) => <ObligationItem obligation={obligation} key={obligation.id} />) : <div className="empty-state">{empty}</div>}
      </div>
    </section>
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
          <h3>{obligation.label}</h3>
          <span>{obligation.id}</span>
        </div>
        <div className={stateClass(obligation.state)}>{stateLabels[obligation.state]}</div>
      </div>
      <div className="obligation-explainer">
        <div>
          <span>Uděláme</span>
          <p>{obligation.action}</p>
        </div>
        <div>
          <span>Proč</span>
          <p>{obligation.whyApplies}</p>
        </div>
      </div>
      <div className="obligation-meta">
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
    throw new Error(details?.message ?? `${url} vrátilo ${response.status}`);
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
  return cause instanceof Error ? cause.message : "Nepodařilo se načíst analýzu.";
}

function buildOutputPlan(analysis: AnalysisResult | null) {
  if (!analysis) {
    return [
      {
        label: "Teď",
        value: "čekám",
        detail: "Po načtení firmy se ukáže krátký plán.",
        tone: "blue"
      },
      {
        label: "Brzy",
        value: "čekám",
        detail: "Odložené termíny se doplní podle obratu, zaměstnanců a provozovny.",
        tone: "amber"
      },
      {
        label: "Kontrola",
        value: "čekám",
        detail: "Výstup musí schválit člověk.",
        tone: "red"
      }
    ] as const;
  }

  const now = analysis.obligations.filter((item) => item.state === "PLATI_NYNI").length;
  const future = analysis.obligations.filter((item) => item.state === "VZNIKNE_POZDEJI").length;
  const monitored = analysis.obligations.filter((item) => item.state === "POUZE_MONITORUJEME").length;
  const missed = analysis.score.firmaradar.missed;
  const extra = analysis.score.firmaradar.extra;

  return [
    {
      label: "Teď",
      value: `${now} kroků`,
      detail: "Povinnosti, které patří do založení firmy a úvodního nastavení.",
      tone: "green"
    },
    {
      label: "Brzy",
      value: `${future + monitored} hlídání`,
      detail: "Termíny a triggery, které se mohou objevit během prvního roku.",
      tone: "amber"
    },
    {
      label: "Důkaz",
      value: `${missed}/${extra}`,
      detail: "Propásnuté a zbytečné povinnosti na veřejných scorer případech.",
      tone: missed || extra ? "red" : "blue"
    }
  ] as const;
}

function groupObligations(obligations: ObligationCard[]) {
  return {
    now: obligations.filter((item) => item.state === "PLATI_NYNI" || item.state === "VYZADUJE_OVERENI"),
    future: obligations.filter((item) => item.state === "VZNIKNE_POZDEJI"),
    monitor: obligations.filter((item) => item.state === "POUZE_MONITORUJEME")
  };
}

function stateClass(state: ObligationState): string {
  return `state-badge state-${state.toLowerCase()}`;
}

function axisStateClass(state: ObligationState): string {
  if (state === "PLATI_NYNI" || state === "VYZADUJE_OVERENI") return "axis-now";
  if (state === "VZNIKNE_POZDEJI") return "axis-soon";
  return "axis-monitor";
}
