import { redirect } from "next/navigation";
import { Link2Off, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { normalTelepon, waLink } from "@/lib/format";

export const metadata = { title: "Tugas antar" };
export const dynamic = "force-dynamic";

export default async function KurirPage() {
  const session = await getSession();
  if (!session || session.role !== "kurir") redirect("/kurir/masuk");

  const settings = await getSettings();
  const nomorAdmin = settings.whatsappAdmin || settings.telepon;

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Halaman kurir</p>
        <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[30px]">
          Buka link tugas dari admin
        </h1>
        <p className="mt-1 max-w-[460px] text-[12.5px] leading-relaxed text-muted">
          Setiap pesanan punya link sendiri. Admin mengirim link lewat WhatsApp,
          lalu Anda cukup membuka link itu.
        </p>
      </div>

      <section className="card p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-mist text-brand">
            <Link2Off size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-extrabold text-navy">
              Satu link untuk satu pesanan
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              Link hanya berisi pesanan yang ditugaskan ke Anda. Setelah pesanan
              ditandai diantar, link otomatis tidak bisa dipakai lagi.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-3 border-t border-line pt-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-mist text-brand">
            <ShieldCheck size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-extrabold text-navy">
              Tidak ada data pelanggan lain
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              Halaman ini tidak menampilkan daftar pesanan, nominal, atau
              riwayat. Data pelanggan hanya terlihat di link tugas Anda.
            </p>
          </div>
        </div>

        <a
          href={waLink(
            nomorAdmin,
            "Halo admin, saya kurir. Mohon kirim link tugas antar hari ini.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-3 w-full"
        >
          Minta link tugas ke admin
        </a>
        <p className="mt-2 text-center text-[10.5px] text-muted">
          Admin: {normalTelepon(nomorAdmin).replace(/^62/, "0")}
        </p>
      </section>
    </div>
  );
}
