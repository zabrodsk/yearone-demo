import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeFirmWithModel } from "@/lib/agent";
import { toErrorResponse } from "@/lib/api-errors";

const schema = z.object({
  firmId: z.string().min(1)
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

  try {
    return NextResponse.json(await analyzeFirmWithModel(parsed.data.firmId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
