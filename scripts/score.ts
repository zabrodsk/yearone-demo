import { runPythonScorer } from "../src/lib/score";

const result = runPythonScorer();
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
