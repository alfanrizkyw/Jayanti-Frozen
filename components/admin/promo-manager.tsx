"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Megaphone,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { ImageCropper } from "@/components/admin/image-cropper";
import { tanggal } from "@/lib/format";
import type { Promotion } from "@/lib/types";

function keLokal(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function statusPromo(p: Promotion) {
  const now = Date.now();
  if (!p.aktif) return { label: "Nonaktif", tone: "bg-[#EEF2F7] text-muted" };
  if (p.mulai && new Date(p.mulai).getTime() > now)
    return { label: "Terjadwal", tone: "bg-[#FFF4E3] text-[#8A520B]" };
  if (p.selesai && new Date(p.selesai).getTime() < now)
    return { label: "Berakhir", tone: "bg-[#EEF2F7] text-muted" };
  return { label: "Tayang", tone: "bg-leaf-soft text-leaf" };
}

export function PromoManager({ promotions }: { promotions: Promotion[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<Promotion | "baru" | null>(null);
  const [hapus, setHapus] = useState<Promotion | null>(null);
  const [proses, setProses] = useState(false);
  const [error, setError] = useState("");

  async function hapusPromo(p: Promotion) {
    setProses(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/promotions?id=${encodeURIComponent(p.id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menghapus promo.");
      setHapus(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus promo.");
    } finally {
      setProses(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Tampilan toko</p>
          <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[28px]">
            Promo & banner
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Banner tampil besar di beranda, pengumuman muncul di atas halaman toko.
          </p>
        </div>
        <button type="button" onClick={() => setEdit("baru")} className="btn btn-primary">
          <Plus size={16} /> Buat promo
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3.5 py-2.5 text-[11.5px] text-[#8F2E25]"
        >
          <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {promotions.map((p) => {
          const st = statusPromo(p);
          return (
            <article key={p.id} className="card overflow-hidden">
              {p.tipe === "banner" && (
                <div className="relative aspect-[16/7] w-full bg-paper">
                  {p.gambar ? (
                    <Image
                      src={p.gambar}
                      alt={p.judul}
                      fill
                      sizes="(max-width: 1024px) 100vw, 520px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-muted">
                      <ImagePlus size={26} />
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 text-white">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-sky">
                      {p.badge || "Promo"}
                    </p>
                    <p className="mt-0.5 text-[15px] font-extrabold">{p.judul}</p>
                    {p.deskripsi && (
                      <p className="mt-0.5 line-clamp-1 text-[10.5px] text-white/75">
                        {p.deskripsi}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[9.5px] font-bold text-brand">
                    {p.tipe === "banner" ? <Sparkles size={10} /> : <Megaphone size={10} />}
                    {p.tipe === "banner" ? "Banner beranda" : "Pengumuman"}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${st.tone}`}>
                    {st.label}
                  </span>
                  {p.cta && (
                    <span className="ml-auto text-[9.5px] font-semibold text-muted">
                      Tombol: {p.cta}
                    </span>
                  )}
                </div>

                {p.tipe === "pengumuman" && (
                  <div className="mt-2 rounded-xl border border-[#C9E1F7] bg-mist/60 px-3 py-2.5">
                    <p className="text-[12px] font-bold text-navy">{p.judul}</p>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
                      {p.deskripsi || "Tanpa keterangan tambahan."}
                    </p>
                  </div>
                )}

                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
                  <CalendarDays size={11} />
                  {tanggal(p.mulai)} – {tanggal(p.selesai)}
                </p>

                <div className="mt-2.5 flex items-center justify-end gap-1.5 border-t border-line pt-2.5">
                  <button
                    type="button"
                    onClick={() => setEdit(p)}
                    className="btn btn-sm btn-outline"
                  >
                    <Pencil size={13} /> Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => setHapus(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-[#FDF2F1] hover:text-[#8F2E25]"
                    aria-label={`Hapus promo ${p.judul}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {promotions.length === 0 && (
        <div className="card flex flex-col items-center px-5 py-14 text-center">
          <Megaphone size={26} className="text-brand" />
          <p className="mt-3 text-[14px] font-bold text-navy">Belum ada promo</p>
          <p className="mt-1 text-[12px] text-muted">
            Buat banner atau pengumuman untuk tampil di beranda.
          </p>
          <button
            type="button"
            onClick={() => setEdit("baru")}
            className="btn btn-primary btn-sm mt-4"
          >
            <Plus size={14} /> Buat promo pertama
          </button>
        </div>
      )}

      {edit && (
        <PromoForm
          promo={edit === "baru" ? null : edit}
          onClose={() => setEdit(null)}
          onSaved={() => {
            setEdit(null);
            router.refresh();
          }}
        />
      )}

      {hapus && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-navy-deep/55 p-4 backdrop-blur-sm fade-in">
          <div className="card w-full max-w-[380px] p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FDF2F1] text-[#8F2E25]">
              <Trash2 size={19} />
            </span>
            <h2 className="mt-3 text-[16px] font-extrabold text-navy">Hapus promo?</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              “{hapus.judul}” akan dihapus dari beranda.
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setHapus(null)} className="btn btn-outline flex-1">
                Batal
              </button>
              <button
                type="button"
                onClick={() => hapusPromo(hapus)}
                disabled={proses}
                className="btn flex-1 bg-[#A3352C] text-white hover:bg-[#8c2a22]"
              >
                {proses ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={14} />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PromoForm({
  promo,
  onClose,
  onSaved,
}: {
  promo: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [tipe, setTipe] = useState<Promotion["tipe"]>(promo?.tipe ?? "pengumuman");
  const [judul, setJudul] = useState(promo?.judul ?? "");
  const [deskripsi, setDeskripsi] = useState(promo?.deskripsi ?? "");
  const [badge, setBadge] = useState(promo?.badge ?? "");
  const [cta, setCta] = useState(promo?.cta ?? "/katalog");
  const [gambar, setGambar] = useState(promo?.gambar ?? "");
  const [aktif, setAktif] = useState(promo?.aktif ?? true);
  const [mulai, setMulai] = useState(
    keLokal(promo?.mulai ?? "") || keLokal(new Date().toISOString()),
  );
  const [selesai, setSelesai] = useState(
    keLokal(promo?.selesai ?? "") ||
      keLokal(new Date(Date.now() + 30 * 86400000).toISOString()),
  );
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [simpan, setSimpan] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSimpan(true);
    setError("");
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promo?.id,
          tipe,
          judul,
          deskripsi,
          badge,
          gambar,
          cta,
          aktif,
          mulai: mulai ? new Date(mulai).toISOString() : "",
          selesai: selesai ? new Date(selesai).toISOString() : "",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menyimpan promo.");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan promo.");
      setSimpan(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/55 backdrop-blur-sm fade-in sm:items-center sm:p-4">
      <div className="flex max-h-[94svh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-[22px] bg-white shadow-2xl sm:rounded-[22px]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5 md:px-5">
          <div>
            <h2 className="text-[15px] font-extrabold text-navy">
              {promo ? "Ubah promo" : "Buat promo baru"}
            </h2>
            <p className="text-[10.5px] text-muted">Atur tampilan dan masa tayang.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-paper"
            aria-label="Tutup formulir promo"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto px-4 py-4 md:px-5">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-paper p-1">
            {(
              [
                { key: "pengumuman", label: "Pengumuman atas", icon: Megaphone },
                { key: "banner", label: "Banner beranda", icon: Sparkles },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTipe(key)}
                className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  tipe === key ? "bg-white text-navy shadow-sm" : "text-muted"
                }`}
                aria-pressed={tipe === key}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {tipe === "banner" && (
            <div className="mt-4">
              <span className="label">Foto banner</span>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-paper">
                {gambar ? (
                  <Image
                    src={gambar}
                    alt="Foto banner"
                    fill
                    sizes="560px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full flex-col items-center justify-center gap-1.5 text-muted">
                    <ImagePlus size={24} />
                    <span className="text-[10.5px] font-semibold">Belum ada foto</span>
                  </span>
                )}
              </div>
              <label className="btn btn-outline btn-sm mt-2 w-full cursor-pointer">
                <Camera size={14} /> Pilih & atur foto banner
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setCropFile(f);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
              <p className="mt-1.5 text-[10px] text-muted">
                Otomatis dipotong 16:9 · 1600 × 900 piksel.
              </p>
            </div>
          )}

          <div className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
              <div>
                <label htmlFor="pr-judul" className="label">Judul</label>
                <input
                  id="pr-judul"
                  className="field"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder={
                    tipe === "banner" ? "Promo akhir pekan" : "Judul pengumuman"
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="pr-badge" className="label">Label kecil</label>
                <input
                  id="pr-badge"
                  className="field"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Contoh: Hemat 30%"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pr-deskripsi" className="label">Keterangan</label>
              <textarea
                id="pr-deskripsi"
                className="field"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan promo dengan kalimat singkat."
                rows={2}
              />
            </div>

            {tipe === "banner" && (
              <div>
                <label htmlFor="pr-cta" className="label">Tujuan tombol</label>
                <input
                  id="pr-cta"
                  className="field"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="/katalog"
                />
                <p className="mt-1 text-[10px] text-muted">
                  Gunakan alamat halaman, misalnya /katalog atau /produk/chicken-nugget.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="pr-mulai" className="label">Mulai tayang</label>
                <input
                  id="pr-mulai"
                  type="datetime-local"
                  className="field"
                  value={mulai}
                  onChange={(e) => setMulai(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="pr-selesai" className="label">Berakhir</label>
                <input
                  id="pr-selesai"
                  type="datetime-local"
                  className="field"
                  value={selesai}
                  onChange={(e) => setSelesai(e.target.value)}
                />
              </div>
            </div>

            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-line px-3">
              <input
                type="checkbox"
                checked={aktif}
                onChange={(e) => setAktif(e.target.checked)}
                className="h-4 w-4 accent-[#2166AC]"
              />
              <span className="text-[12px] font-semibold text-navy">
                Aktifkan promo sekarang
              </span>
            </label>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3 py-2 text-[11.5px] text-[#8F2E25]"
            >
              <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
            </div>
          )}

          <div className="sticky bottom-0 -mx-4 mt-4 flex gap-2 border-t border-line bg-white px-4 pb-1 pt-3 md:-mx-5 md:px-5">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              Batal
            </button>
            <button type="submit" disabled={simpan} className="btn btn-primary flex-1">
              {simpan ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {simpan ? "Menyimpan…" : "Simpan promo"}
            </button>
          </div>
        </form>
      </div>

      {cropFile && (
        <ImageCropper
          file={cropFile}
          rasio="banner"
          onCancel={() => setCropFile(null)}
          onDone={(url) => {
            setGambar(url);
            setCropFile(null);
          }}
        />
      )}
    </div>
  );
}
