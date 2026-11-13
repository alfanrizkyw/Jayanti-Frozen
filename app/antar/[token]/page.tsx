import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3 } from "lucide-react";
import { Logo } from "@/components/logo";
import { TugasKurirBoard } from "@/components/kurir/tugas-kurir";
import { getTugasKurir } from "@/lib/tugas-kurir";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tugas antar" };

export default async function HalamanAntar({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let bersih = token;
  try {
    bersih = decodeURIComponent(token);
  } catch {
    // Token dari alamat yang rusak tetap dicoba apa adanya.
  }
  const hasil = await getTugasKurir(bersih);
  if (hasil.state === "tidak-ada") notFound();

  return (
    <div className="min-h-svh bg-paper">
      <header className="bg-navy-deep text-white">
        <div className="mx-auto flex h-16 w-full max-w-[760px] items-center gap-3 px-4">
          <Logo tone="light" size={38} />
          <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky sm:inline">
            Tugas antar
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-4 pb-16 pt-4">
        {hasil.state === "aktif" ? (
          <TugasKurirBoard tugas={hasil.tugas} />
        ) : hasil.state === "belum" ? (
          <section className="card flex flex-col items-center px-5 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-brand">
              <Clock3 size={26} />
            </span>
            <h1 className="mt-3 text-[16px] font-extrabold text-navy">
              Tugas belum dimulai
            </h1>
            <p className="mt-1 max-w-[360px] text-[12.5px] leading-relaxed text-muted">
              Admin belum menyerahkan pesanan ini ke kurir. Buka lagi link ini
              setelah pesanan diserahkan.
            </p>
            <Link
              href={`/antar/${encodeURIComponent(bersih)}`}
              className="btn btn-outline btn-sm mt-4"
            >
              Muat ulang
            </Link>
          </section>
        ) : (
          <section className="card flex flex-col items-center px-5 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-soft text-leaf">
              <CheckCircle2 size={26} />
            </span>
            <h1 className="mt-3 text-[16px] font-extrabold text-navy">
              Pesanan sudah selesai
            </h1>
            <p className="mt-1 max-w-[360px] text-[12.5px] leading-relaxed text-muted">
              Link tugas ini sudah dipakai dan tidak bisa dibuka lagi. Minta
              link baru ke admin bila ada pesanan lain.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
