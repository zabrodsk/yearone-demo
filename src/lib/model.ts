import { spawnSync } from "node:child_process";
import type { AnalysisResult, ModelStatus } from "./types";

const OPENAI_DEFAULT_MODEL = "gpt-4.1-mini";
const ANTHROPIC_DEFAULT_MODEL = "claude-sonnet-4-5";
const CLI_TIMEOUT_MS = 60_000;

export function buildModelStatus(result?: Pick<AnalysisResult, "firm" | "obligations" | "founderBurden">): ModelStatus {
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

  if (hasOpenAi) {
    return {
      mode: "openai",
      available: true,
      message: "OPENAI_API_KEY je nastaven. Demo stale pouziva pravidla pro rozhodnuti.",
      narration: buildLocalNarration(result)
    };
  }

  if (hasAnthropic) {
    return {
      mode: "anthropic",
      available: true,
      message: "ANTHROPIC_API_KEY je nastaven. Demo stale pouziva pravidla pro rozhodnuti.",
      narration: buildLocalNarration(result)
    };
  }

  return {
    mode: "local",
    available: false,
    message: "Model key neni nastaven. Bezi lokalni agentni orchestrator a deterministicka pravidla.",
    narration: buildLocalNarration(result)
  };
}

export async function buildLiveModelStatus(
  result: Pick<AnalysisResult, "firm" | "obligations" | "timeline" | "founderBurden" | "score">
): Promise<ModelStatus> {
  const provider = process.env.MODEL_PROVIDER?.trim().toLowerCase() ?? "auto";

  if (provider === "local") {
    return buildModelStatus(result);
  }

  if (provider === "claude-cli") {
    return buildClaudeCliNarration(result);
  }

  if (provider === "codex-cli") {
    return buildCodexCliNarration(result);
  }

  if ((provider === "openai" || provider === "auto") && process.env.OPENAI_API_KEY) {
    return buildOpenAiNarration(result);
  }

  if ((provider === "anthropic" || provider === "auto") && process.env.ANTHROPIC_API_KEY) {
    return buildAnthropicNarration(result);
  }

  if (provider === "auto") {
    return buildClaudeCliNarration(result);
  }

  return buildModelStatus(result);
}

function buildLocalNarration(result?: Pick<AnalysisResult, "firm" | "obligations" | "founderBurden">): string {
  if (!result) {
    return "Agentni vysvetleni momentalne bezi lokalne. Rozhodnuti dela pravidlovy engine nad sandbox registry.";
  }

  const future = result.obligations.filter((item) => item.state === "VZNIKNE_POZDEJI").length;
  return [
    `${result.firm.nazev}: agent nacetl zamer, overil zivnost a vyhodnotil ${result.obligations.length} povinnosti.`,
    `Budouci hlidani: ${future}. Dotazy zakladateli: ${result.founderBurden}.`,
    "Zavazne kroky zustavaji pred lidskym schvalenim."
  ].join(" ");
}

async function buildOpenAiNarration(
  result: Pick<AnalysisResult, "firm" | "obligations" | "timeline" | "founderBurden" | "score">
): Promise<ModelStatus> {
  const model = process.env.OPENAI_MODEL ?? OPENAI_DEFAULT_MODEL;

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model,
      input: buildNarrationPrompt(result)
    });

    return {
      mode: "openai",
      available: true,
      message: `OpenAI SDK aktivni (${model}). Povinnosti stale urcuje pravidlovy engine.`,
      narration: cleanNarration(response.output_text) || buildLocalNarration(result)
    };
  } catch (error) {
    return liveFallback("openai", model, error, result);
  }
}

async function buildAnthropicNarration(
  result: Pick<AnalysisResult, "firm" | "obligations" | "timeline" | "founderBurden" | "score">
): Promise<ModelStatus> {
  const model = process.env.ANTHROPIC_MODEL ?? ANTHROPIC_DEFAULT_MODEL;

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model,
      max_tokens: 220,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: buildNarrationPrompt(result)
        }
      ]
    });

    return {
      mode: "anthropic",
      available: true,
      message: `Claude SDK aktivni (${model}). Povinnosti stale urcuje pravidlovy engine.`,
      narration: cleanNarration(response.content.map((block) => ("text" in block ? block.text : "")).join(" ")) || buildLocalNarration(result)
    };
  } catch (error) {
    return liveFallback("anthropic", model, error, result);
  }
}

function buildNarrationPrompt(result: Pick<AnalysisResult, "firm" | "obligations" | "timeline" | "founderBurden" | "score">): string {
  const obligations = result.obligations.map((item) => `${item.id}: ${item.label} (${item.state})`).join("\n");
  const futureItems = result.timeline
    .filter((item) => item.status === "VZNIKNE_POZDEJI" || item.status === "POUZE_MONITORUJEME")
    .map((item) => `${item.label}: ${item.due}`)
    .join("\n");

  return [
    "Napis kratke ceske vysvetleni pro hackathon demo YearOne.",
    "Nemen seznam povinnosti, nevymyslej nova ID a netvrd, ze jsi provedl zavazne podani.",
    "Maximalne 3 vety, konkretne pro tuto firmu.",
    "",
    `Firma: ${result.firm.nazev}`,
    `Predmet: ${result.firm.predmet}`,
    `Obrat: ${result.firm.predpokladany_obrat_rok} Kc`,
    `Zamestnanci: ${result.firm.plan_zamestnancu}`,
    `Provozovna: ${result.firm.provozovna ? "ano" : "ne"}`,
    `Dotazy zakladateli: ${result.founderBurden}`,
    `Skore YearOne: missed=${result.score.firmaradar.missed}, extra=${result.score.firmaradar.extra}`,
    "",
    "Povinnosti:",
    obligations,
    "",
    "Budouci hlidani:",
    futureItems || "zadne"
  ].join("\n");
}

function cleanNarration(text: string | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function buildClaudeCliNarration(
  result: Pick<AnalysisResult, "firm" | "obligations" | "timeline" | "founderBurden" | "score">
): ModelStatus {
  const run = spawnSync(
    "claude",
    ["--print", "--output-format", "text", "--permission-mode", "dontAsk", "--no-session-persistence", buildNarrationPrompt(result)],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: CLI_TIMEOUT_MS
    }
  );

  if (run.status === 0) {
    return {
      mode: "claude-cli",
      available: true,
      message: "Claude Code CLI aktivni pres lokalni prihlaseni/subscription. Povinnosti stale urcuje pravidlovy engine.",
      narration: cleanNarration(run.stdout) || buildLocalNarration(result)
    };
  }

  return cliFallback("claude-cli", run, result);
}

function buildCodexCliNarration(
  result: Pick<AnalysisResult, "firm" | "obligations" | "timeline" | "founderBurden" | "score">
): ModelStatus {
  const modelArgs = process.env.CODEX_MODEL ? ["--model", process.env.CODEX_MODEL] : [];
  const run = spawnSync(
    "codex",
    [
      "exec",
      "--skip-git-repo-check",
      "--ephemeral",
      "--sandbox",
      "read-only",
      "--ask-for-approval",
      "never",
      "-C",
      process.cwd(),
      ...modelArgs,
      buildNarrationPrompt(result)
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: CLI_TIMEOUT_MS
    }
  );

  if (run.status === 0) {
    return {
      mode: "codex-cli",
      available: true,
      message: "Codex CLI aktivni pres lokalni prihlaseni/subscription. Povinnosti stale urcuje pravidlovy engine.",
      narration: cleanNarration(run.stdout) || buildLocalNarration(result)
    };
  }

  return cliFallback("codex-cli", run, result);
}

function cliFallback(
  mode: "claude-cli" | "codex-cli",
  run: ReturnType<typeof spawnSync>,
  result: Pick<AnalysisResult, "firm" | "obligations" | "founderBurden">
): ModelStatus {
  const detail =
    cleanNarration(outputToString(run.stderr)) ||
    cleanNarration(outputToString(run.stdout)) ||
    run.error?.message ||
    `exit ${run.status ?? "unknown"}`;
  return {
    mode,
    available: false,
    message: `${mode === "claude-cli" ? "Claude Code" : "Codex"} CLI volani selhalo: ${detail}. Demo pokracuje lokalne.`,
    narration: buildLocalNarration(result)
  };
}

function outputToString(value: string | Buffer | null | undefined): string {
  if (typeof value === "string") return value;
  return value?.toString("utf8") ?? "";
}

function liveFallback(
  mode: "openai" | "anthropic",
  model: string,
  error: unknown,
  result: Pick<AnalysisResult, "firm" | "obligations" | "founderBurden">
): ModelStatus {
  const detail = error instanceof Error ? error.message : "neznamy problem";
  return {
    mode,
    available: false,
    message: `${mode === "openai" ? "OpenAI" : "Claude"} SDK volani selhalo (${model}): ${detail}. Demo pokracuje lokalne.`,
    narration: buildLocalNarration(result)
  };
}
