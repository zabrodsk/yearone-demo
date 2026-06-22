import { NextResponse } from "next/server";
import { calculateScore, exportForBodovac } from "@/lib/score";

export function GET() {
  return NextResponse.json({
    score: calculateScore(),
    choices: exportForBodovac()
  });
}
