import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, PackageSearch, Search, X } from "lucide-react";
import { getStorefront } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { KatalogToolbar } from "@/components/katalog-toolbar";

export const metadata: Metadata = {
  title: "Katalog produk",
  description:
    "Telusuri nugget, sosis, bakso, kentang, seafood, dan daging beku Jayanti Frozen. Harga jelas dan stok selalu diperbarui.",
};

const urutLabel: Record<string, string> = {
  unggulan: "rekomendasi",
  "harga-rendah": "harga terendah",
  "harga-tinggi": "harga tertinggi",
  nama: "nama A–Z",
};

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; urut?: string; stok?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const kategori = sp.kategori ?? "";
  const urut = sp.urut ?? "unggulan";
  const hanyaTersedia = sp.stok === "1";

  const { products } = await getStorefront();
  const kategoriList = Array.from(new Set(products.map((p) => p.kategori)));

  let hasil = products.filter((p) => {
    if (kategori && p.kategori !== kategori) return false;
    if (hanyaTersedia && p.stok <= 0) return false;
    if (q) {
      const cari = q.toLowerCase();
      if (
        !`${p.nama} ${p.kategori} ${p.deskripsi}`.toLowerCase().includes(cari)
      )
        return false;
    }
    return true;
  });

  hasil = [...hasil].sort((a, b) => {
    if (urut === "harga-rendah")
      return (a.hargaPromo ?? a.harga) - (b.hargaPromo ?? b.harga);
    if (urut === "harga-tinggi")
      return (b.hargaPromo ?? b.harga) - (a.hargaPromo ?? a.harga);
    if (urut === "nama") return a.nama.localeCompare(b.nama);
    if (a.unggulan !== b.unggulan) return a.unggulan ? -1 : 1;
    return a.nama.localeCompare(b.nama);
  });

  const hrefKategori = (k?: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (k) p.set("kategori", k);
    if (urut !== "unggulan") p.set("urut", urut);
    if (hanyaTersedia) p.set("stok", "1");
    const s = p.toString();
    return `/katalog${s ? `?${s}` : ""}`;
  };

  return (
    <div className="container-page pt-5 md:pt-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-muted">
        <Link href="/" className="hover:text-navy">Beranda</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-navy">Katalog</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight text-navy md:text-[34px]">
            Katalog produk
          </h1>
          <p className="mt-1.5 max-w-[520px] text-[13.5px] leading-relaxed text-muted">
            Semua frozen food yang tersedia di toko. Stok dan harga diperbarui
            langsung oleh admin.
          </p>
        </div>
        <p className="hidden rounded-xl border border-line bg-white px-4 py-3 text-[12px] font-medium text-muted sm:block">
          Ambil di toko <span className="text-line">·</span> antar kurir area Probolinggo
        </p>
      </div>

      <div className="mt-5 rounded-[18px] border border-line bg-white p-3.5 shadow-card md:p-4">
        <form action="/katalog" method="get" role="search" className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <label htmlFor="cari-katalog" className="sr-only">Cari produk</label>
            <input
              id="cari-katalog"
              name="q"
              defaultValue={q}
              placeholder="Cari produk, kategori, atau kebutuhan…"
              className="field pl-10"
              autoComplete="off"
            />
          </div>
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          {urut !== "unggulan" && <input type="hidden" name="urut" value={urut} />}
          {hanyaTersedia && <input type="hidden" name="stok" value="1" />}
          <button type="submit" className="btn btn-primary px-4 sm:px-5">Cari</button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={hrefKategori()}
            className={`chip ${!kategori ? "chip-active" : ""}`}
          >
            Semua
          </Link>
          {kategoriList.map((k) => (
            <Link
              key={k}
              href={hrefKategori(k)}
              className={`chip ${kategori === k ? "chip-active" : ""}`}
            >
              {k}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <KatalogToolbar urut={urut} stok={hanyaTersedia} total={hasil.length} />
      </div>

      {(q || kategori || hanyaTersedia) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-muted">Filter aktif:</span>
          {q && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#C9E1F7] bg-mist px-2.5 py-1 text-[11.5px] font-semibold text-brand">
              “{q}”
            </span>
          )}
          {kategori && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#C9E1F7] bg-mist px-2.5 py-1 text-[11.5px] font-semibold text-brand">
              {kategori}
            </span>
          )}
          {hanyaTersedia && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#C9E1F7] bg-mist px-2.5 py-1 text-[11.5px] font-semibold text-brand">
              stok tersedia
            </span>
          )}
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-bold text-muted hover:text-navy"
          >
            <X size={12} /> Hapus filter
          </Link>
        </div>
      )}

      {hasil.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {hasil.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#C9E1F7] bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-brand">
            <PackageSearch size={26} strokeWidth={1.8} />
          </span>
          <h2 className="mt-4 text-[17px] font-extrabold text-navy">
            Produk tidak ditemukan
          </h2>
          <p className="mt-1.5 max-w-[340px] text-[13px] leading-relaxed text-muted">
            Coba kata kunci lain atau lihat semua produk. Admin toko siap
            membantu lewat WhatsApp.
          </p>
          <Link href="/katalog" className="btn btn-primary mt-5">
            Lihat semua produk
          </Link>
        </div>
      )}

      <p className="mt-5 text-center text-[11.5px] text-muted">
        Menampilkan hasil {urutLabel[urut] ?? "rekomendasi"} · harga sudah termasuk pajak
      </p>
    </div>
  );
}
