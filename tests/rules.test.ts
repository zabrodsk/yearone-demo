import { describe, expect, it } from "vitest";
import { getAllFirms, getIntent, getPublicCases } from "../src/lib/sandbox";
import { analyzeFirm } from "../src/lib/agent";
import { DPH_THRESHOLD_CZK, evaluateRules } from "../src/lib/rules";
import { calculateScore, runPythonScorer } from "../src/lib/score";

describe("YearOne rules", () => {
  it("matches every public scorer case", () => {
    for (const publicCase of getPublicCases()) {
      const result = evaluateRules(getIntent(publicCase.id));
      expect(result.obligationIds.sort()).toEqual([...publicCase.spravne_povinnosti].sort());
    }
  });

  it("scores zero missed and zero extra obligations", () => {
    expect(calculateScore()).toEqual({
      cases: 6,
      baseline: {
        missed: 28,
        extra: 2
      },
      firmaradar: {
        missed: 0,
        extra: 0
      }
    });
  });

  it("keeps founder burden at zero on the judged path", () => {
    for (const publicCase of getPublicCases()) {
      expect(analyzeFirm(publicCase.id).founderBurden).toBe(0);
    }
  });

  it("covers DPH threshold on both sides", () => {
    const firms = getAllFirms();
    const overThreshold = firms.find((firm) => firm.predpokladany_obrat_rok > DPH_THRESHOLD_CZK);
    const underThreshold = firms.find((firm) => firm.predpokladany_obrat_rok <= DPH_THRESHOLD_CZK);

    expect(overThreshold).toBeDefined();
    expect(underThreshold).toBeDefined();
    expect(evaluateRules(overThreshold!).obligationIds).toContain("DPH");
    expect(evaluateRules(underThreshold!).obligationIds).not.toContain("DPH");
  });

  it("covers employees and provozovna triggers", () => {
    const withEmployees = getAllFirms().find((firm) => firm.plan_zamestnancu > 0)!;
    const withoutEmployees = getAllFirms().find((firm) => firm.plan_zamestnancu === 0)!;
    const withBranch = getAllFirms().find((firm) => firm.provozovna)!;
    const withoutBranch = getAllFirms().find((firm) => !firm.provozovna)!;

    expect(evaluateRules(withEmployees).obligationIds).toEqual(expect.arrayContaining(["ZAM_CSSZ", "ZAM_ZP"]));
    expect(evaluateRules(withoutEmployees).obligationIds).not.toEqual(expect.arrayContaining(["ZAM_CSSZ", "ZAM_ZP"]));
    expect(evaluateRules(withBranch).obligationIds).toContain("PROVOZOVNA");
    expect(evaluateRules(withoutBranch).obligationIds).not.toContain("PROVOZOVNA");
  });

  it("covers all trade classes", () => {
    const allIds = new Set(getAllFirms().flatMap((firm) => evaluateRules(firm).obligationIds));
    expect(allIds).toContain("ZIVNOST_VOLNA");
    expect(allIds).toContain("ZIVNOST_VAZANA");
    expect(allIds).toContain("ZIVNOST_KONCESE");
  });

  it("survives without model credentials", () => {
    const result = analyzeFirm("FIRMA-0004");
    expect(result.model.mode).toBe("local");
    expect(result.model.narration).toContain("agent");
    expect(result.obligations).toHaveLength(10);
  });

  it("bridges to the provided Python scorer", () => {
    const result = runPythonScorer();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Vase reseni:  propasnute=0, zbytecne navic=0");
  });
});
