import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeFirmWithModel } from "@/lib/agent";

const schema = z.object({
  firmId: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const body = schema.parse(await request.json());
  return NextResponse.json(await analyzeFirmWithModel(body.firmId));
}
