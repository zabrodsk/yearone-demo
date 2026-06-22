import { spawnSync } from "node:child_process";
import path from "node:path";
import { getIntent, getPublicCases } from "./sandbox";
import { evaluateRules } from "./rules";
import type { ObligationId, ScoreSummary } from "./types";

export function exportForBodovac(): Record<string, ObligationId[]> {
  const result: Record<string, ObligationId[]> = {};
  for (const publicCase of getPublicCases()) {
    result[publicCase.id] = evaluateRules(getIntent(publicCase.id)).obligationIds;
  }
  return result;
}

export function calculateScore(): ScoreSummary {
  const publicCases = getPublicCases();
  const choices = exportForBodovac();
  const baselineChoices = Object.fromEntries(publicCases.map((item) => [item.id, item.baseline_povinnosti]));

  const baseline = scoreChoices(baselineChoices);
  const firmaradar = scoreChoices(choices);

  return {
    cases: publicCases.length,
    baseline: {
      missed: baseline.missed,
      extra: baseline.extra
    },
    firmaradar: {
      missed: firmaradar.missed,
      extra: firmaradar.extra
    }
  };
}

export function scoreChoices(choices: Record<string, ObligationId[]>) {
  let missed = 0;
  let extra = 0;

  for (const publicCase of getPublicCases()) {
    const expected = new Set(publicCase.spravne_povinnosti);
    const actual = new Set(choices[publicCase.id] ?? []);
    missed += [...expected].filter((id) => !actual.has(id)).length;
    extra += [...actual].filter((id) => !expected.has(id)).length;
  }

  return { missed, extra };
}

export function runPythonScorer() {
  const dataDir = path.join(process.cwd(), "data", "sandbox");
  const script = [
    "import json, sys",
    `sys.path.insert(0, ${JSON.stringify(dataDir)})`,
    "from bodovac import vyhodnot",
    `volby = json.loads(${JSON.stringify(JSON.stringify(exportForBodovac()))})`,
    "result = vyhodnot(volby)",
    "print('JSON_RESULT=' + json.dumps(result))"
  ].join("\n");

  const run = spawnSync("python3", ["-c", script], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  return {
    status: run.status,
    stdout: run.stdout,
    stderr: run.stderr
  };
}
