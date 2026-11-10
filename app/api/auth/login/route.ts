import { NextResponse } from "next/server";
import { developerPassword, setSession } from "@/lib/auth";
import { verifyAdmin, verifyCourier } from "@/lib/data";
import { sameSecret } from "@/lib/password";

const BATAS = 8;
const JEDA = 5 * 60_000;

const percobaan = new Map<string, { jumlah: number; sampai: number }>();

function kunciPercobaan(req: Request, peran: string) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "lokal";
  return `${ip}:${peran}`;
}

function terlaluBanyak(kunci: string) {
  const data = percobaan.get(kunci);
  if (!data || data.sampai < Date.now()) {
    percobaan.delete(kunci);
    return false;
  }
  return data.jumlah >= BATAS;
}

function catatGagal(kunci: string) {
  const sekarang = Date.now();
  const data = percobaan.get(kunci);
  if (!data || data.sampai < sekarang) {
    percobaan.set(kunci, { jumlah: 1, sampai: sekarang + JEDA });
    return;
  }
  data.jumlah += 1;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const peran = String(body?.role ?? "");
  const sandi = String(body?.sandi ?? "");

  if (!["admin", "kurir", "developer"].includes(peran))
    return NextResponse.json({ error: "Halaman masuk tidak dikenal." }, { status: 400 });

  const kunci = kunciPercobaan(req, peran);
  if (terlaluBanyak(kunci))
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Tunggu 5 menit lalu coba lagi." },
      { status: 429 },
    );

  if (peran === "admin") {
    const admin = await verifyAdmin(sandi);
    if (!admin) {
      catatGagal(kunci);
      return NextResponse.json({ error: "Kata sandi admin salah." }, { status: 401 });
    }
    percobaan.delete(kunci);
    await setSession({ role: "admin", nama: admin.nama, id: admin.id });
    return NextResponse.json({ ok: true, tujuan: "/admin" });
  }

  if (peran === "kurir") {
    const kurir = await verifyCourier(sandi);
    if (!kurir) {
      catatGagal(kunci);
      return NextResponse.json(
        { error: "Kata sandi kurir salah." },
        { status: 401 },
      );
    }
    percobaan.delete(kunci);
    await setSession({ role: "kurir", nama: kurir.nama });
    return NextResponse.json({ ok: true, tujuan: "/kurir" });
  }

  if (!sandi || !sameSecret(sandi, developerPassword())) {
    catatGagal(kunci);
    return NextResponse.json({ error: "Kata sandi developer salah." }, { status: 401 });
  }
  percobaan.delete(kunci);
  await setSession({ role: "developer", nama: "Developer" });
  return NextResponse.json({ ok: true, tujuan: "/developer" });
}
