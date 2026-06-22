import { NextResponse } from "next/server";
import { getAllFirms } from "@/lib/sandbox";

export function GET() {
  return NextResponse.json({ firms: getAllFirms() });
}
