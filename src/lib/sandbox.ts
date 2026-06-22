import fs from "node:fs";
import path from "node:path";
import type { AresRecord, FirmIntent, ObligationId, PublicCase, TradeType } from "./types";

const dataDir = path.join(process.cwd(), "data", "sandbox");

function readJson<T>(name: string): T {
  const filePath = path.join(dataDir, name);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getAllFirms(): FirmIntent[] {
  return readJson<FirmIntent[]>("zamery_firem.json");
}

export function getIntent(firmId: string): FirmIntent {
  const firm = getAllFirms().find((item) => item.id === firmId);
  if (!firm) {
    throw new Error(`Unknown firm id: ${firmId}`);
  }
  return firm;
}

export function getObligationCatalog(): Record<ObligationId, string> {
  return readJson<Record<ObligationId, string>>("katalog_povinnosti.json");
}

export function getTradeClassifications(): Record<string, TradeType> {
  return readJson<Record<string, TradeType>>("klasifikace_zivnosti.json");
}

export function getPublicCases(): PublicCase[] {
  return readJson<PublicCase[]>("ukazkove_pripady.json");
}

export function lookupRegistry(type: "zivnost", key: string): { predmet: string; typ_zivnosti: TradeType } | null;
export function lookupRegistry(type: "ares", key: string): AresRecord | null;
export function lookupRegistry(type: "zivnost" | "ares", key: string) {
  if (type === "zivnost") {
    const tradeType = getTradeClassifications()[key];
    return tradeType ? { predmet: key, typ_zivnosti: tradeType } : null;
  }

  const records = readJson<Record<string, AresRecord>>("registr_ares.json");
  return records[String(key)] ?? null;
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
  return new Set(Object.keys(getObligationCatalog()) as ObligationId[]);
}
