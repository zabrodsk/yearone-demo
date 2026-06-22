import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseScenarioText, simulateEventWithModel } from "@/lib/agent";

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
  const body = schema.parse(await request.json());
  const event = body.event ?? parseScenarioText(body.text ?? "");
  return NextResponse.json(await simulateEventWithModel(body.firmId, event));
}
