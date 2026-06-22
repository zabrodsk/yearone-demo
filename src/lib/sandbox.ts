import type { AresRecord, FirmIntent, ObligationId, PublicCase, TradeType } from "./types";
import { NotFoundError } from "./errors";
import firmsData from "../../data/sandbox/zamery_firem.json";
import obligationCatalogData from "../../data/sandbox/katalog_povinnosti.json";
import tradeClassificationsData from "../../data/sandbox/klasifikace_zivnosti.json";
import publicCasesData from "../../data/sandbox/ukazkove_pripady.json";
import aresData from "../../data/sandbox/registr_ares.json";

// Static sandbox data is imported (bundled into the build graph) and parsed
// once at module load, instead of re-reading from disk on every call.
const firms = firmsData as unknown as FirmIntent[];
const obligationCatalog = obligationCatalogData as unknown as Record<ObligationId, string>;
const tradeClassifications = tradeClassificationsData as unknown as Record<string, TradeType>;
const publicCases = publicCasesData as unknown as PublicCase[];
const aresRecords = aresData as unknown as Record<string, AresRecord>;

export function getAllFirms(): FirmIntent[] {
  return firms;
}

export function getIntent(firmId: string): FirmIntent {
  const firm = firms.find((item) => item.id === firmId);
  if (!firm) {
    throw new NotFoundError(`Unknown firm id: ${firmId}`);
  }
  return firm;
}

export function getObligationCatalog(): Record<ObligationId, string> {
  return obligationCatalog;
}

export function getTradeClassifications(): Record<string, TradeType> {
  return tradeClassifications;
}

export function getPublicCases(): PublicCase[] {
  return publicCases;
}

export function lookupRegistry(type: "zivnost", key: string): { predmet: string; typ_zivnosti: TradeType } | null;
export function lookupRegistry(type: "ares", key: string): AresRecord | null;
export function lookupRegistry(type: "zivnost" | "ares", key: string) {
  if (type === "zivnost") {
    const tradeType = tradeClassifications[key];
    return tradeType ? { predmet: key, typ_zivnosti: tradeType } : null;
  }

  return aresRecords[String(key)] ?? null;
}

export function lookupLegislation(topic: string) {
  const notes: Record<string, string> = {
    dph: "DPH threshold is configurable for the scorer. Current public guidance also tracks CZK 2,000,000 and CZK 2,536,500 limits.",
    zamestnavatel: "Employer duties are triggered by planned employees and require CSSZ and health-insurance registration.",
    zivnost: "Trade type must come from the sandbox registry, not from model text.",
    evidence: "Ownership evidence and registered-seat marking are treated as always-on hidden obligations for s.r.o."
  };

  return {
    topic,
    source: "katalog legislativnich pravidel",
    note: notes[topic] ?? "Demo metadata; production deployment would require legal review."
  };
}

export function allValidObligationIds(): Set<ObligationId> {
  return new Set(Object.keys(obligationCatalog) as ObligationId[]);
}
