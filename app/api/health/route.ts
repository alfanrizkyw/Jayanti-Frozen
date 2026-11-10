import { NextResponse } from "next/server";
import { readSnapshot } from "@/lib/sheets";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const lingkungan = {
    sheetsUrl: Boolean(process.env.GOOGLE_SHEETS_URL),
    sheetsKey: Boolean(process.env.GOOGLE_SHEETS_KEY),
    authSecret: Boolean(process.env.AUTH_SECRET),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    vercel: Boolean(process.env.VERCEL),
  };

  try {
    const db = await readSnapshot();
    return NextResponse.json({
      ok: true,
      storage: await storageMode(),
      lingkungan,
      jumlah: {
        staff: (db.staff ?? []).length,
        couriers: (db.couriers ?? []).length,
        products: (db.products ?? []).length,
        orders: (db.orders ?? []).length,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        storage: await storageMode(),
        lingkungan,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
