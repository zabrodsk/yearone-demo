import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseScenarioText, simulateEventWithModel } from "@/lib/agent";
import { toErrorResponse } from "@/lib/api-errors";

const schema = z.object({
  firmId: z.string().min(1),
  text: z.string().optional(),
  event: z.object({
    type: z.enum(["employee_start", "increase_turnover", "advance_time", "open_branch", "change_subject", "add_partner", "add_regulated_trade"]),
    text: z.string().min(1),
    employeeStartDate: z.string().optional(),
    turnover: z.number().optional(),
    months: z.number().optional(),
    address: z.string().optional(),
    subject: z.string().optional(),
    partner: z
      .object({
        typ: z.enum(["PO", "FO"]),
        nazev: z.string().optional(),
        ico: z.string().optional(),
        statni_prislusnost: z.string().optional()
      })
      .optional(),
    parsedFrom: z.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ message: "Neplatné JSON tělo požadavku." }, { status: 400 });
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ message: "Neplatný vstup.", issues: parsed.error.issues }, { status: 400 });
  }

  const body = parsed.data;
  const event = body.event ?? parseScenarioText(body.text ?? "");

  try {
    return NextResponse.json(await simulateEventWithModel(body.firmId, event));
  } catch (error) {
    return toErrorResponse(error);
  }
}
