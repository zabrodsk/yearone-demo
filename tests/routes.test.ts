import { NextRequest } from "next/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST as analyzePost } from "../src/app/api/analyze/route";
import { POST as simulatePost } from "../src/app/api/simulate/route";

let previousProvider: string | undefined;

beforeAll(() => {
  // Keep the model path local so route handlers never spawn an AI CLI subprocess.
  previousProvider = process.env.MODEL_PROVIDER;
  process.env.MODEL_PROVIDER = "local";
});

afterAll(() => {
  if (previousProvider === undefined) {
    delete process.env.MODEL_PROVIDER;
  } else {
    process.env.MODEL_PROVIDER = previousProvider;
  }
});

function jsonRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function rawRequest(url: string, body: string): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
}

describe("API route error handling", () => {
  it("returns 200 with obligations for a valid analyze request", async () => {
    const res = await analyzePost(jsonRequest("http://localhost/api/analyze", { firmId: "FIRMA-0004" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.obligations).toHaveLength(10);
  });

  it("returns 400 for a malformed JSON body", async () => {
    const res = await analyzePost(rawRequest("http://localhost/api/analyze", "{not json"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when firmId is missing", async () => {
    const res = await analyzePost(jsonRequest("http://localhost/api/analyze", {}));
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown firm id", async () => {
    const res = await analyzePost(jsonRequest("http://localhost/api/analyze", { firmId: "DOES-NOT-EXIST" }));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.message).toContain("Unknown firm id");
  });

  it("returns 400 for a subject not in the sandbox registry", async () => {
    const res = await simulatePost(
      jsonRequest("http://localhost/api/simulate", {
        firmId: "FIRMA-0004",
        event: { type: "change_subject", text: "x", subject: "TOTALLY MADE UP SUBJECT" }
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain("Missing trade classification");
  });

  it("returns 200 for a valid free-text simulation", async () => {
    const res = await simulatePost(
      jsonRequest("http://localhost/api/simulate", {
        firmId: "FIRMA-0001",
        text: "Co když obrat vzroste na 3 miliony?"
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.scenario.event.type).toBe("increase_turnover");
  });
});
