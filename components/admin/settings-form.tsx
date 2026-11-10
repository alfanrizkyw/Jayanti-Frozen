"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { teleponRapi } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>({
    ...settings,
    telepon: teleponRapi(settings.telepon),
    whatsappAdmin: teleponRapi(settings.whatsappAdmin),
  });
  const [jadwalTeks, setJadwalTeks] = useState(
    (settings.jadwalKirim ?? []).join("\n"),
  );
  const [simpan, setSimpan] = useState(false);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  function ubah<K extends keyof Settings>(key: K, nilai: Settings[K]) {
    setForm((f) => ({ ...f, [key]: nilai }));
    setPesan("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSimpan(true);
    setError("");
    setPesan("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          jadwalKirim: jadwalTeks
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menyimpan pengaturan.");
      setPesan("Pengaturan tersimpan dan langsung dipakai di toko.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengaturan.");
    } finally {
      setSimpan(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {pesan && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-[#C6E7DA] bg-leaf-soft px-3.5 py-2.5 text-[11.5px] text-leaf"
        >
          <CheckCircle2 size={14} className="mt-0.5 flex-none" /> {pesan}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3.5 py-2.5 text-[11.5px] text-[#8F2E25]"
        >
          <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
        </div>
      )}

      <section className="card p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-extrabold text-navy">Status toko</h2>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              Saat tutup, pembeli melihat pemberitahuan dan hanya bisa memilih
              jadwal serta membayar tunai.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.tokoBuka}
            aria-label="Buka atau tutup toko"
            onClick={() => ubah("tokoBuka", !form.tokoBuka)}
            className={`flex h-11 min-w-[118px] items-center justify-center gap-2 rounded-full border px-4 text-[11.5px] font-extrabold transition-colors ${
              form.tokoBuka
                ? "border-leaf bg-leaf text-white"
                : "border-[#E3C78C] bg-[#FEF8E9] text-[#8A520B]"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-white/90" />
            {form.tokoBuka ? "TOKO BUKA" : "TOKO TUTUP"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="s-alamat" className="label">Alamat toko</label>
            <input
              id="s-alamat"
              className="field"
              value={form.alamat}
              onChange={(e) => ubah("alamat", e.target.value)}
              placeholder="Jl. Melati No. 12, Malang"
              required
            />
          </div>
          <div>
            <label htmlFor="s-jam" className="label">Jam buka</label>
            <input
              id="s-jam"
              className="field"
              value={form.jamBuka}
              onChange={(e) => ubah("jamBuka", e.target.value)}
              placeholder="08.00 – 21.00"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="s-tutup" className="label">
              Keterangan saat toko tutup
            </label>
            <textarea
              id="s-tutup"
              className="field"
              value={form.tutupCatatan}
              onChange={(e) => ubah("tutupCatatan", e.target.value)}
              placeholder="Toko sedang tutup. Silakan pilih jadwal kirim/ambil yang tersedia."
              rows={2}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="s-jadwal" className="label">
              Pilihan jadwal kirim / ambil
            </label>
            <textarea
              id="s-jadwal"
              className="field"
              value={jadwalTeks}
              onChange={(e) => {
                setJadwalTeks(e.target.value);
                setPesan("");
              }}
              placeholder={"Hari ini 10.00–12.00\nHari ini 14.00–16.00\nBesok 08.00–10.00"}
              rows={4}
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
              Satu jadwal per baris. Daftar ini muncul di checkout dan bisa
              diubah kapan saja. Minimal satu jadwal.
            </p>
          </div>
        </div>
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-[15px] font-extrabold text-navy">Identitas toko</h2>
        <p className="mt-0.5 text-[11.5px] text-muted">
          Tampil di header, halaman kontak, dan pesan pesanan.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="s-nama" className="label">Nama toko</label>
            <input
              id="s-nama"
              className="field"
              value={form.namaToko}
              onChange={(e) => ubah("namaToko", e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="s-telp" className="label">Nomor WhatsApp toko</label>
            <input
              id="s-telp"
              className="field"
              value={form.telepon}
              onChange={(e) => ubah("telepon", e.target.value)}
              placeholder="0898 0440 095"
              inputMode="tel"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="s-wa-admin" className="label">
              Nomor WhatsApp admin (notifikasi pesanan)
            </label>
            <input
              id="s-wa-admin"
              className="field"
              value={form.whatsappAdmin}
              onChange={(e) => ubah("whatsappAdmin", e.target.value)}
              placeholder="0898 0440 095"
              inputMode="tel"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
              Setiap pesanan baru dikirim ke nomor ini beserta tautan langsung
              ke halaman konfirmasi. Pengiriman otomatis memakai token
              WhatsApp di pengaturan server.
            </p>
          </div>
          <div>
            <label htmlFor="s-estimasi" className="label">Estimasi antar (menit)</label>
            <input
              id="s-estimasi"
              type="number"
              min={5}
              className="field"
              value={form.estimasiAntar}
              onChange={(e) => ubah("estimasiAntar", Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-[15px] font-extrabold text-navy">Ongkos kirim</h2>
        <p className="mt-0.5 text-[11.5px] text-muted">
          Berlaku untuk pengantaran. Pembeli melihat angkanya di keranjang dan checkout.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="s-ongkir" className="label">Ongkir per pesanan (Rp)</label>
            <input
              id="s-ongkir"
              type="number"
              min={0}
              className="field"
              value={form.ongkir}
              onChange={(e) => ubah("ongkir", Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="s-gratis" className="label">Gratis ongkir mulai (Rp)</label>
            <input
              id="s-gratis"
              type="number"
              min={0}
              className="field"
              value={form.gratisOngkirMin}
              onChange={(e) => ubah("gratisOngkirMin", Number(e.target.value))}
            />
          </div>
        </div>
        <p className="mt-2 rounded-lg bg-mist/70 px-3 py-2 text-[10.5px] leading-relaxed text-brand">
          Contoh: belanja Rp {form.gratisOngkirMin.toLocaleString("id-ID")} atau lebih
          otomatis gratis ongkir. Di bawah itu dikenakan Rp{" "}
          {form.ongkir.toLocaleString("id-ID")}.
        </p>
      </section>

      <section className="card p-4 md:p-5">
        <h2 className="text-[15px] font-extrabold text-navy">Pembayaran</h2>
        <p className="mt-0.5 text-[11.5px] text-muted">
          Data ini muncul sebagai instruksi pembayaran bagi pembeli.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="s-rek" className="label">Nomor rekening / e-wallet</label>
            <input
              id="s-rek"
              className="field"
              value={form.rekening}
              onChange={(e) => ubah("rekening", e.target.value)}
              placeholder="BCA 1234567890"
            />
          </div>
          <div>
            <label htmlFor="s-an" className="label">Atas nama</label>
            <input
              id="s-an"
              className="field"
              value={form.atasNama}
              onChange={(e) => ubah("atasNama", e.target.value)}
              placeholder="Jayanti Frozen"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="s-qris" className="label">Nama merchant QRIS</label>
            <input
              id="s-qris"
              className="field"
              value={form.qrisNama}
              onChange={(e) => ubah("qrisNama", e.target.value)}
              placeholder="Jayanti Frozen"
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:-mx-7 md:px-7">
        <p className="hidden text-[10.5px] text-muted sm:block">
          Perubahan langsung dipakai setelah disimpan.
        </p>
        <button type="submit" disabled={simpan} className="btn btn-primary ml-auto">
          {simpan ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {simpan ? "Menyimpan…" : "Simpan pengaturan"}
        </button>
      </div>
    </form>
  );
}
