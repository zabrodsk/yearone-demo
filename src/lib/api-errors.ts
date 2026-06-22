import { NextResponse } from "next/server";
import { InvalidInputError, NotFoundError } from "./errors";

/**
 * Maps a thrown error to a sanitized JSON response with the right status.
 * Unknown errors are logged server-side and reported generically so internals
 * (and stack traces) never reach the client.
 */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof NotFoundError) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof InvalidInputError) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  console.error("Unhandled API error:", error);
  return NextResponse.json({ message: "Interní chyba serveru." }, { status: 500 });
}
