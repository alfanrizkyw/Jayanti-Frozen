import { NextResponse } from "next/server";
import { simpanUlasan } from "@/lib/data";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ kode: string }> },
) {
  const { kode } = await params;
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Ulasan tidak valid." }, { status: 400 });

  try {
    const order = await simpanUlasan(
      decodeURIComponent(kode),
      Number(body.bintang),
      String(body.ulasan ?? ""),
    );
    return NextResponse.json(
      { ok: true, order },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ulasan gagal disimpan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
