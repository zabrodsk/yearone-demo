export type ObligationId =
  | "OR_ZAPIS"
  | "DPPO"
  | "DATOVKA"
  | "ZIVNOST_VOLNA"
  | "ZIVNOST_VAZANA"
  | "ZIVNOST_KONCESE"
  | "SIDLO_OZNACENI"
  | "SKUTECNI_MAJITELE"
  | "DPH"
  | "ZAM_CSSZ"
  | "ZAM_ZP"
  | "PROVOZOVNA";

export type TradeType = "volna" | "vazana" | "koncese";

export type ObligationState =
  | "PLATI_NYNI"
  | "VZNIKNE_POZDEJI"
  | "POUZE_MONITORUJEME"
  | "VYZADUJE_OVERENI"
  | "SPLNENO";

export type ToolStatus = "ok" | "warn" | "error";

export interface Address {
  adresa: string;
  obec?: string;
  ruian_kod?: string;
}

export interface Partner {
  typ: "PO" | "FO";
  nazev?: string;
  ico?: string;
  statni_prislusnost?: string;
}

export interface FirmIntent {
  id: string;
  forma: string;
  nazev: string;
  predmet: string;
  sidlo: Address;
  spolecnici: Partner[];
  predpokladany_obrat_rok: number;
  plan_zamestnancu: number;
  provozovna: Address | null;
}

export interface AresRecord {
  ico: string;
  nazev: string;
  aktivni: boolean;
}

export interface PublicCase {
  id: string;
  predmet: string;
  obrat: number;
  zamestnanci: number;
  provozovna: boolean;
  spravne_povinnosti: ObligationId[];
  baseline_povinnosti: ObligationId[];
  proc_zradne: string;
}

export interface ToolCall {
  id: string;
  name: "get_intent" | "lookup_registry" | "lookup_legislation" | "schedule" | "validate_output";
  input: Record<string, unknown>;
  output: unknown;
  status: ToolStatus;
  durationMs: number;
  timestamp: string;
}

export interface TimelineItem {
  id: string;
  obligationId: ObligationId;
  label: string;
  status: ObligationState;
  due: string;
  authority: string;
  reason: string;
  automaticPreparation: string;
}

export interface ObligationCard {
  id: ObligationId;
  label: string;
  state: ObligationState;
  trigger: string;
  dataSource: string;
  ruleSource: string;
  whyApplies: string;
  confidence: "vysoka" | "stredni" | "nizka";
  action: string;
  requiresHumanApproval: boolean;
}

export interface ScoreSummary {
  cases: number;
  baseline: {
    missed: number;
    extra: number;
  };
  firmaradar: {
    missed: number;
    extra: number;
  };
}

export interface ModelStatus {
  mode: "local" | "openai" | "anthropic" | "claude-cli" | "codex-cli";
  available: boolean;
  message: string;
  narration: string;
}

export interface AnalysisResult {
  firm: FirmIntent;
  obligations: ObligationCard[];
  timeline: TimelineItem[];
  toolCalls: ToolCall[];
  baseline: ObligationId[];
  founderBurden: number;
  missingData: number;
  score: ScoreSummary;
  model: ModelStatus;
  approved: boolean;
  scenario?: ScenarioResult;
}

export interface ScenarioEvent {
  type:
    | "employee_start"
    | "increase_turnover"
    | "advance_time"
    | "open_branch"
    | "change_subject"
    | "add_partner"
    | "add_regulated_trade";
  text: string;
  employeeStartDate?: string;
  turnover?: number;
  months?: number;
  address?: string;
  subject?: string;
  partner?: Partner;
  parsedFrom?: string;
}

export interface ScenarioDelta {
  addedObligations: ObligationId[];
  removedObligations: ObligationId[];
  unchangedObligations: ObligationId[];
  timelineImpact: string[];
  founderQuestionDelta: number;
  administrativeComplexity: "nizsi" | "stejna" | "vyssi";
}

export interface ScenarioResult {
  event: ScenarioEvent;
  delta: ScenarioDelta;
  persistence: "simulated_only" | "can_add_to_plan";
}
