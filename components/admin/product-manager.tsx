"use client";

import { Gambar } from "@/components/gambar";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Minus,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { ImageCropper } from "@/components/admin/image-cropper";
import { rupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductManager({
  products,
  kategori,
}: {
  products: Product[];
  kategori: string[];
}) {
  const router = useRouter();
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("semua");
  const [edit, setEdit] = useState<Product | "baru" | null>(null);
  const [hapus, setHapus] = useState<string | null>(null);
  const [hapusProses, setHapusProses] = useState(false);
  const [error, setError] = useState("");
  const [stokProses, setStokProses] = useState<string | null>(null);

  const daftar = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return products
      .filter((p) => (filter === "semua" ? true : p.kategori === filter))
      .filter((p) => !q || p.nama.toLowerCase().includes(q))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [products, cari, filter]);

  async function ubahStok(p: Product, delta: number) {
    const stok = Math.max(0, p.stok + delta);
    if (stok === p.stok) return;
    setStokProses(p.id);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, stok }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal mengubah stok.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah stok.");
    } finally {
      setStokProses(null);
    }
  }

  async function hapusProduk(id: string) {
    setHapusProses(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menghapus produk.");
      setHapus(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus produk.");
    } finally {
      setHapusProses(false);
    }
  }

  const jumlahAktif = products.filter((p) => p.aktif).length;
  const habis = products.filter((p) => p.stok === 0).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Katalog</p>
          <h1 className="mt-1 text-[24px] font-extrabold text-navy md:text-[28px]">
            Produk & stok
          </h1>
          <p className="mt-1 text-[12.5px] text-muted">
            {products.length} produk · {jumlahAktif} tampil di toko
            {habis > 0 ? ` · ${habis} stok habis` : ""}
          </p>
        </div>
        <button type="button" onClick={() => setEdit("baru")} className="btn btn-primary">
          <Plus size={16} /> Tambah produk
        </button>
      </div>

      <div className="card flex flex-col gap-2.5 p-2.5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 px-1">
          <Search size={17} className="flex-none text-muted" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama produk"
            className="min-h-10 w-full min-w-0 border-0 bg-transparent text-[13px] outline-none placeholder:text-[#93a3b6]"
            aria-label="Cari produk"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="field min-h-10 w-full text-[12.5px] sm:w-[190px]"
          aria-label="Filter kategori"
        >
          <option value="semua">Semua kategori</option>
          {kategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3.5 py-2.5 text-[11.5px] text-[#8F2E25]"
        >
          <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {daftar.map((p) => (
          <article key={p.id} className="card overflow-hidden">
            <div className="flex gap-3 p-3">
              <div className="relative h-[72px] w-[96px] flex-none overflow-hidden rounded-lg border border-line bg-paper">
                <Gambar
                  src={p.gambar}
                  alt={p.nama}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                {!p.aktif && (
                  <span className="absolute inset-x-0 bottom-0 bg-navy/80 py-0.5 text-center text-[8.5px] font-bold text-white">
                    TIDAK TAMPIL
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h2 className="line-clamp-2 text-[12.5px] font-bold leading-snug text-navy">
                    {p.nama}
                  </h2>
                  {p.unggulan && (
                    <span className="flex-none rounded bg-[#FFF4E3] px-1.5 py-0.5 text-[8.5px] font-extrabold text-[#8A520B]">
                      UNGGULAN
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10.5px] text-muted">
                  {p.kategori} · {p.satuan}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <p className="stat-num text-[13px] font-extrabold text-navy">
                    {rupiah(p.hargaPromo ?? p.harga)}
                  </p>
                  {p.hargaPromo && (
                    <p className="text-[10px] text-muted line-through">{rupiah(p.harga)}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-line bg-paper/50 px-3 py-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => ubahStok(p, -1)}
                  disabled={stokProses === p.id || p.stok === 0}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-navy transition-colors hover:bg-mist disabled:opacity-40"
                  aria-label={`Kurangi stok ${p.nama}`}
                >
                  <Minus size={14} />
                </button>
                <span
                  className={`min-w-[56px] text-center text-[11px] font-extrabold ${
                    p.stok === 0
                      ? "text-[#8F2E25]"
                      : p.stok <= 5
                        ? "text-[#8A520B]"
                        : "text-navy"
                  }`}
                >
                  {stokProses === p.id ? (
                    <Loader2 size={13} className="mx-auto animate-spin" />
                  ) : (
                    <>
                      {p.stok} <span className="text-[9px] font-bold text-muted">pack</span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => ubahStok(p, 1)}
                  disabled={stokProses === p.id}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-navy transition-colors hover:bg-mist disabled:opacity-40"
                  aria-label={`Tambah stok ${p.nama}`}
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEdit(p)}
                  className="flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold text-brand hover:bg-mist"
                >
                  <Pencil size={13} /> Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setHapus(p.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-[#FDF2F1] hover:text-[#8F2E25]"
                  aria-label={`Hapus ${p.nama}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {daftar.length === 0 && (
        <div className="card flex flex-col items-center px-5 py-14 text-center">
          <Package size={28} className="text-brand" />
          <p className="mt-3 text-[14px] font-bold text-navy">Produk tidak ditemukan</p>
          <p className="mt-1 text-[12px] text-muted">Ubah kata kunci atau kategori.</p>
        </div>
      )}

      {edit && (
        <ProductForm
          produk={edit === "baru" ? null : edit}
          kategori={kategori}
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
            <h2 className="mt-3 text-[16px] font-extrabold text-navy">Hapus produk?</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Produk akan dihapus dari katalog. Riwayat pesanan lama tetap tersimpan.
            </p>
            {error && (
              <p className="mt-2 rounded-lg bg-[#FDF2F1] px-3 py-2 text-[11px] text-[#8F2E25]">
                {error}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setHapus(null)}
                className="btn btn-outline flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => hapusProduk(hapus)}
                disabled={hapusProses}
                className="btn flex-1 bg-[#A3352C] text-white hover:bg-[#8c2a22]"
              >
                {hapusProses ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  produk,
  kategori,
  onClose,
  onSaved,
}: {
  produk: Product | null;
  kategori: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nama, setNama] = useState(produk?.nama ?? "");
  const [kategoriNilai, setKategoriNilai] = useState(produk?.kategori ?? "");
  const [satuan, setSatuan] = useState(produk?.satuan ?? "pcs");
  const [harga, setHarga] = useState(produk ? String(produk.harga) : "");
  const [hargaPromo, setHargaPromo] = useState(
    produk?.hargaPromo ? String(produk.hargaPromo) : "",
  );
  const [stok, setStok] = useState(produk ? String(produk.stok) : "0");
  const [deskripsi, setDeskripsi] = useState(produk?.deskripsi ?? "");
  const [gambar, setGambar] = useState(produk?.gambar ?? "");
  const [unggulan, setUnggulan] = useState(produk?.unggulan ?? false);
  const [aktif, setAktif] = useState(produk?.aktif ?? true);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [simpan, setSimpan] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSimpan(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: produk?.id,
          nama,
          kategori: kategoriNilai,
          satuan,
          harga: Number(harga),
          hargaPromo: hargaPromo ? Number(hargaPromo) : null,
          stok: Number(stok),
          deskripsi,
          gambar,
          unggulan,
          aktif,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menyimpan produk.");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk.");
      setSimpan(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/55 backdrop-blur-sm fade-in sm:items-center sm:p-4">
      <div className="flex max-h-[94svh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[22px] bg-white shadow-2xl sm:rounded-[22px]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5 md:px-5">
          <div>
            <h2 className="text-[15px] font-extrabold text-navy">
              {produk ? "Ubah produk" : "Tambah produk baru"}
            </h2>
            <p className="text-[10.5px] text-muted">
              Perubahan langsung tampil di toko.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-paper"
            aria-label="Tutup formulir produk"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto px-4 py-4 md:px-5">
          <div className="grid gap-4 sm:grid-cols-[210px_1fr]">
            <div>
              <span className="label">Foto produk</span>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-paper">
                {gambar ? (
                  <Gambar
                    src={gambar}
                    alt="Foto produk"
                    fill
                    sizes="210px"
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
                <Camera size={14} /> Pilih & atur foto
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
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                Foto otomatis dipotong ke rasio 4:3 berukuran 900 × 675 piksel.
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-[10.5px] font-bold text-brand">
                  Pakai tautan gambar
                </summary>
                <input
                  value={gambar}
                  onChange={(e) => setGambar(e.target.value)}
                  className="field mt-1.5 min-h-10 text-[11.5px]"
                  placeholder="https://… atau /produk/nama.jpg"
                  aria-label="Tautan gambar produk"
                />
              </details>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="p-nama" className="label">Nama produk</label>
                <input
                  id="p-nama"
                  className="field"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Chicken Nugget"
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="p-kategori" className="label">Kategori</label>
                  <input
                    id="p-kategori"
                    className="field"
                    list="daftar-kategori"
                    value={kategoriNilai}
                    onChange={(e) => setKategoriNilai(e.target.value)}
                    placeholder="Nugget & sosis"
                    required
                  />
                  <datalist id="daftar-kategori">
                    {kategori.map((k) => (
                      <option key={k} value={k} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label htmlFor="p-satuan" className="label">Satuan</label>
                  <input
                    id="p-satuan"
                    className="field"
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    placeholder="pack / pcs / kg"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="p-harga" className="label">Harga normal</label>
                  <input
                    id="p-harga"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className="field"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="32000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="p-promo" className="label">Harga promo</label>
                  <input
                    id="p-promo"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className="field"
                    value={hargaPromo}
                    onChange={(e) => setHargaPromo(e.target.value)}
                    placeholder="Opsional"
                  />
                </div>
                <div>
                  <label htmlFor="p-stok" className="label">Stok (pack)</label>
                  <input
                    id="p-stok"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className="field"
                    value={stok}
                    onChange={(e) => setStok(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="p-deskripsi" className="label">Deskripsi singkat</label>
            <textarea
              id="p-deskripsi"
              className="field"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Isi, berat, dan cara penyajian produk."
              rows={3}
            />
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-line px-3">
              <input
                type="checkbox"
                checked={unggulan}
                onChange={(e) => setUnggulan(e.target.checked)}
                className="h-4 w-4 accent-[#2166AC]"
              />
              <span className="text-[12px] font-semibold text-navy">
                Tampilkan di beranda (unggulan)
              </span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-line px-3">
              <input
                type="checkbox"
                checked={aktif}
                onChange={(e) => setAktif(e.target.checked)}
                className="h-4 w-4 accent-[#2166AC]"
              />
              <span className="text-[12px] font-semibold text-navy">
                Produk aktif dan bisa dibeli
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
              {simpan ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              {simpan ? "Menyimpan…" : "Simpan produk"}
            </button>
          </div>
        </form>
      </div>

      {cropFile && (
        <ImageCropper
          file={cropFile}
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
