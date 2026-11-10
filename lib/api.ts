import { NextResponse } from "next/server";
import { getSession } from "./auth";
import type { SessionUser } from "./types";

export async function guard(role: SessionUser["role"]) {
  const session = await getSession();
  if (!session || session.role !== role) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Akses ditolak. Silakan masuk terlebih dahulu." },
        { status: 401 },
      ),
    };
  }
  return { session, response: null };
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
