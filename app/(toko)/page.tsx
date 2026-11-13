import { Gambar } from "@/components/gambar";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Search,
  Snowflake,
  Sun,
} from "lucide-react";
import { getStorefront } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { waLink } from "@/lib/format";

export default async function BerandaPage() {
  const { products, banner, settings } = await getStorefront();
  const unggulan = products.filter((p) => p.unggulan).slice(0, 8);
  const tampil = (unggulan.length >= 4 ? unggulan : products).slice(0, 8);
  const kategori = Array.from(new Set(products.map((p) => p.kategori)));
  const promo = banner;
  const diskon = products.reduce((maks, p) => {
    if (!p.hargaPromo) return maks;
    return Math.max(maks, Math.round((1 - p.hargaPromo / p.harga) * 100));
  }, 0);
  const gambarHero = promo?.gambar || "/brand/hero-promo.jpg";

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Gambar
          src={gambarHero}
          alt="Aneka frozen food Yanti Frozen di atas es"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[74%_48%] lg:object-[64%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/45 lg:bg-[linear-gradient(90deg,#102b50_0%,rgba(16,43,80,0.94)_40%,rgba(16,43,80,0.6)_66%,rgba(16,43,80,0.18)_100%)]"
        />

        <div className="container-page relative flex min-h-[400px] flex-col justify-center pb-7 pt-6 sm:min-h-[440px] lg:min-h-[500px] lg:pb-12 lg:pt-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[11.5px] font-semibold text-white/85 backdrop-blur">
              <Sun size={13} className={settings.tokoBuka ? "text-[#8ee0a8]" : "text-[#ffd48a]"} />
              {settings.tokoBuka ? "Buka" : "Tutup sementara"} · {settings.jamBuka}
            </span>
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[11.5px] font-semibold text-white/85 backdrop-blur">
              <MapPin size={13} className="text-sky" />
              Probolinggo
            </span>
          </div>

          <h1 className="mt-3 max-w-[560px] text-[32px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[42px] lg:text-[50px]">
            Frozen food,
            <br />
            <span className="text-sky">siap masak</span> kapan saja.
          </h1>
          <p className="mt-2.5 max-w-[400px] text-[14px] leading-relaxed text-white/75">
            Pesan antar atau ambil sendiri. Bayar tunai, QRIS, atau transfer.
          </p>

          <form
            action="/katalog"
            method="get"
            className="mt-4 flex gap-2 sm:max-w-[420px]"
            role="search"
          >
            <label htmlFor="cari-beranda" className="sr-only">
              Cari produk
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="cari-beranda"
                name="q"
                placeholder="Cari nugget, bakso…"
                className="field h-12 border-transparent pl-10 text-[14px]"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary bg-sky px-4 text-navy hover:bg-[#8ac8f5] sm:px-5"
            >
              Cari
            </button>
          </form>
        </div>
      </section>

      <section className="container-page mt-3 md:mt-4">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <a
            href={waLink(settings.telepon, "Halo Yanti Frozen, saya mau bertanya produk.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-paper sm:px-4"
          >
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
              <WhatsAppIcon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">Butuh bantuan?</p>
              <p className="truncate text-[11.5px] text-muted">
                Chat langsung ke admin.
              </p>
            </div>
            <ChevronRight size={17} className="flex-none text-muted" />
          </a>

          {settings.mapsUrl && (
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center gap-3 border-t border-line px-3.5 py-2.5 transition-colors hover:bg-paper sm:px-4"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
                <MapPin size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-extrabold text-navy">Lokasi toko</p>
                <p className="truncate text-[11.5px] text-muted">{settings.alamat}</p>
              </div>
              <ChevronRight size={17} className="flex-none text-muted" />
            </a>
          )}
        </div>
      </section>

      <section className="container-page mt-7 md:mt-10">
        <h2 className="text-[19px] font-extrabold text-navy md:text-[23px]">
          Kategori
        </h2>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <Link href="/katalog" className="chip chip-active">
            Semua
            <span className="rounded-full bg-white/15 px-1.5 text-[10px]">{products.length}</span>
          </Link>
          {kategori.map((k) => (
            <Link
              key={k}
              href={`/katalog?kategori=${encodeURIComponent(k)}`}
              className="chip"
            >
              {k}
              <span className="rounded-full bg-paper px-1.5 text-[10px] text-muted">
                {products.filter((p) => p.kategori === k).length}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-7 md:mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[19px] font-extrabold text-navy md:text-[23px]">
            Produk
          </h2>
          <Link
            href="/katalog"
            className="flex min-h-11 flex-none items-center gap-1 whitespace-nowrap text-[13px] font-bold text-brand hover:text-brand-dark"
          >
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {tampil.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {promo && (
        <section className="container-page mt-6 md:mt-8">
          <Link
            href={promo.cta || "/katalog"}
            className="flex items-center gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(110deg,#132f57,#1d5f9e)] px-4 py-3.5 text-white md:px-5"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-sky">
              <Snowflake size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-sky">
                {promo.badge || "Promo"}
              </p>
              <p className="mt-0.5 text-[13.5px] font-extrabold leading-snug sm:text-[14px]">
                {promo.judul}
              </p>
              <p className="hidden truncate text-[11.5px] text-white/65 sm:block">
                {diskon > 0
                  ? `Diskon hingga ${diskon}% untuk produk pilihan`
                  : promo.deskripsi}
              </p>
            </div>
            <span className="btn btn-sm flex-none bg-white text-navy hover:bg-white/90">
              Lihat <ArrowRight size={14} />
            </span>
          </Link>
        </section>
      )}

      <section className="container-page mt-8 md:mt-12">
        <div className="rounded-2xl border border-line bg-white p-4 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[19px] font-extrabold text-navy md:text-[23px]">
              Cara pesan
            </h2>
            <p className="text-[12px] text-muted">
              Tanpa daftar akun, cukup nama dan nomor HP.
            </p>
          </div>

          <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                judul: "Pilih produk",
                teks: "Masukkan ke keranjang.",
              },
              {
                judul: "Isi data",
                teks: "Nama dan nomor HP.",
              },
              {
                judul: "Bayar",
                teks: "Tunai, QRIS, atau transfer.",
              },
              {
                judul: "Terima",
                teks: "Ambil sendiri atau diantar.",
              },
            ].map((step, i) => (
              <li
                key={step.judul}
                className="flex items-start gap-2.5 rounded-xl bg-paper px-3 py-2.5"
              >
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-mist text-[11px] font-extrabold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold leading-snug text-navy">
                    {step.judul}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">
                    {step.teks}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
