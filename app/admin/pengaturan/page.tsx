import { Database, Sheet } from "lucide-react";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminData } from "@/lib/data";
import { storageMode } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pengaturan · Admin" };

export default async function AdminSettings() {
  const [db, mode] = await Promise.all([getAdminData(), storageMode()]);

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Konfigurasi</p>
        <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[28px]">
          Pengaturan toko
        </h1>
        <p className="mt-1 text-[12.5px] text-muted">
          Atur identitas, ongkir, dan instruksi pembayaran.
        </p>
      </div>

      <div className="card flex items-start gap-3 p-3.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
          {mode === "sheets" ? <Sheet size={17} /> : <Database size={17} />}
        </span>
        <div>
          <p className="text-[12.5px] font-bold text-navy">
            {mode === "sheets"
              ? "Terhubung Google Sheets"
              : mode === "lokal"
                ? "Penyimpanan lokal (khusus pengembangan)"
                : "Google Sheets belum terhubung"}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
            {mode === "sheets"
              ? "Semua pesanan, produk, dan pengaturan disimpan ke spreadsheet melalui Apps Script."
              : mode === "lokal"
                ? "Server pengembangan menyimpan data di berkas lokal. Produksi selalu memakai Google Sheets."
                : "Isi GOOGLE_SHEETS_URL dan GOOGLE_SHEETS_KEY di Environment Variables Vercel, lalu redeploy."}
          </p>
        </div>
      </div>

      <SettingsForm settings={db.settings} />
    </div>
  );
}
