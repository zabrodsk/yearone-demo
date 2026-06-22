import { afterEach, describe, expect, it } from "vitest";
import { analyzeFirm, analyzeFirmWithModel, parseScenarioText, simulateEvent, simulateFreeText } from "../src/lib/agent";
import { calculateScore } from "../src/lib/score";

const modelEnvSnapshot = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  provider: process.env.MODEL_PROVIDER
};

afterEach(() => {
  restoreModelKeys();
});

describe("YearOne API-shaped behavior", () => {
  it("returns the local model fallback with ten obligations and zero founder burden for FIRMA-0004", async () => {
    await withNoModelKeys(() => {
      const result = analyzeFirm("FIRMA-0004");

      expect(result.model.mode).toBe("local");
      expect(result.model.available).toBe(false);
      expect(result.obligations).toHaveLength(10);
      expect(result.founderBurden).toBe(0);
    });
  });

  it("keeps the async SDK path local when credentials are missing", async () => {
    await withNoModelKeys(async () => {
      const result = await analyzeFirmWithModel("FIRMA-0004");

      expect(result.model.mode).toBe("local");
      expect(result.model.available).toBe(false);
      expect(result.obligations).toHaveLength(10);
      expect(result.score.firmaradar).toEqual({ missed: 0, extra: 0 });
    });
  });

  it("changes the employer timeline due date when simulating an employee start", () => {
    const result = simulateEvent("FIRMA-0001", {
      type: "employee_start",
      text: "Prvni zamestnanec nastupuje",
      employeeStartDate: "1. dubna"
    });
    const employerTimelineItem = result.timeline.find((item) => item.obligationId === "ZAM_CSSZ");

    expect(employerTimelineItem).toBeDefined();
    expect(employerTimelineItem?.due).toBe("1. dubna");
  });

  it("parses free-text what-if questions into structured events", () => {
    expect(parseScenarioText("Co když obrat vzroste na 3 miliony?")).toMatchObject({
      type: "increase_turnover",
      turnover: 3_000_000
    });
    expect(parseScenarioText("Co když otevřu pobočku v Brně?")).toMatchObject({
      type: "open_branch",
      address: "Pobocka Brno"
    });
    expect(parseScenarioText("Co když přidám realitní zprostředkování?")).toMatchObject({
      type: "add_regulated_trade",
      subject: "Realitni zprostredkovani"
    });
  });

  it("returns a scenario delta for free-text DPH simulation", () => {
    const result = simulateFreeText("FIRMA-0001", "Co když obrat vzroste na 3 miliony?");

    expect(result.scenario?.event.type).toBe("increase_turnover");
    expect(result.scenario?.delta.addedObligations).toContain("DPH");
    expect(result.scenario?.delta.founderQuestionDelta).toBe(0);
    expect(result.scenario?.persistence).toBe("simulated_only");
  });

  it("adds provozovna when simulating a new branch", () => {
    const result = simulateEvent("FIRMA-0002", {
      type: "open_branch",
      text: "Otevru pobocku v Brne",
      address: "Pobocka Brno"
    });

    expect(result.firm.provozovna?.adresa).toBe("Pobocka Brno");
    expect(result.scenario?.delta.addedObligations).toContain("PROVOZOVNA");
  });

  it("shows regulated trade impact when changing subject", () => {
    const result = simulateEvent("FIRMA-0004", {
      type: "add_regulated_trade",
      text: "Pridam realitni zprostredkovani",
      subject: "Realitni zprostredkovani"
    });

    expect(result.firm.predmet).toBe("Realitni zprostredkovani");
    expect(result.obligations.map((item) => item.id)).toContain("ZIVNOST_VAZANA");
    expect(result.scenario?.delta.addedObligations).toContain("ZIVNOST_VAZANA");
    expect(result.scenario?.delta.removedObligations).toContain("ZIVNOST_VOLNA");
  });

  it("adds a monitoring timeline item when simulating advance_time", () => {
    const result = simulateEvent("FIRMA-0004", {
      type: "advance_time",
      text: "Posun o tri mesice",
      months: 3
    });

    expect(result.timeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "FIRMA-0004-advance-3",
          status: "POUZE_MONITORUJEME",
          due: "za 3 mesicu"
        })
      ])
    );
  });

  it("keeps the score at zero missed and zero extra obligations", () => {
    expect(calculateScore().firmaradar).toEqual({
      missed: 0,
      extra: 0
    });
  });
});

async function withNoModelKeys<T>(fn: () => T | Promise<T>): Promise<T> {
  const previousOpenAi = process.env.OPENAI_API_KEY;
  const previousAnthropic = process.env.ANTHROPIC_API_KEY;
  const previousProvider = process.env.MODEL_PROVIDER;

  delete process.env.OPENAI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  process.env.MODEL_PROVIDER = "local";

  try {
    return await fn();
  } finally {
    restoreModelKeys(previousOpenAi, previousAnthropic, previousProvider);
  }
}

function restoreModelKeys(
  openai: string | undefined = modelEnvSnapshot.openai,
  anthropic: string | undefined = modelEnvSnapshot.anthropic,
  provider: string | undefined = modelEnvSnapshot.provider
) {
  if (openai === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = openai;
  }

  if (anthropic === undefined) {
    delete process.env.ANTHROPIC_API_KEY;
  } else {
    process.env.ANTHROPIC_API_KEY = anthropic;
  }

  if (provider === undefined) {
    delete process.env.MODEL_PROVIDER;
  } else {
    process.env.MODEL_PROVIDER = provider;
  }
}
