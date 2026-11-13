import { Gambar } from "@/components/gambar";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  CheckCircle2,
  ExternalLink,
  Headset,
  MapPin,
  Search,
  Snowflake,
  Store,
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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_110%_at_0%_0%,rgba(114,185,238,0.24),transparent_62%)]"
        />

        <div className="container-page relative flex min-h-[500px] flex-col justify-center pb-16 pt-7 sm:min-h-[540px] lg:min-h-[580px] lg:pb-24 lg:pt-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[11.5px] font-semibold text-white/85 backdrop-blur">
              <Sun size={13} className={settings.tokoBuka ? "text-[#8ee0a8]" : "text-[#ffd48a]"} />
              {settings.tokoBuka ? "Buka" : "Tutup sementara"} · {settings.jamBuka}
            </span>
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[11.5px] font-semibold text-white/85 backdrop-blur">
              <MapPin size={13} className="text-sky" />
              Probolinggo
            </span>
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[11.5px] font-semibold text-white/85 backdrop-blur">
              <Snowflake size={13} className="text-sky" />
              Tetap beku −18°C
            </span>
          </div>

          <h1 className="mt-4 max-w-[560px] text-[34px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-[44px] lg:text-[52px]">
            Frozen food,
            <br />
            <span className="text-sky">siap masak</span> kapan saja.
          </h1>
          <p className="mt-3.5 max-w-[420px] text-[14px] leading-relaxed text-white/75 sm:text-[15px]">
            Pesan antar atau ambil sendiri. Bayar tunai, QRIS, atau transfer.
          </p>

          <form
            action="/katalog"
            method="get"
            className="mt-5 flex gap-2 sm:max-w-[420px]"
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
                placeholder="Cari nugget, bakso, kentang…"
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

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-medium text-white/70">
            {[
              { icon: Store, text: "Ambil di toko" },
              { icon: Bike, text: "Antar kurir" },
              { icon: MapPin, text: "Lacak langsung" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon size={14} className="text-sky" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 text-paper">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="block h-[38px] w-full md:h-[58px]"
            fill="currentColor"
          >
            <path d="M0 34c220 40 400-22 700 6 300 28 520 26 740-10v50H0V34Z" />
          </svg>
        </div>
      </section>

      <section className="container-page mt-4 md:mt-6">
        <div className="grid gap-3 md:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 lg:flex-row lg:items-center lg:justify-between md:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-mist text-brand">
                <Headset size={20} />
              </span>
              <div>
                <p className="text-[14.5px] font-extrabold text-navy">Butuh bantuan?</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                  Chat WhatsApp toko, dibalas langsung oleh admin.
                </p>
              </div>
            </div>
            <a
              href={waLink(settings.telepon, "Halo Yanti Frozen, saya mau bertanya produk.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full flex-none lg:w-auto"
            >
              <WhatsAppIcon size={16} /> WhatsApp toko
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4 md:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-mist text-brand">
                <MapPin size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] font-extrabold text-navy">Lokasi toko</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                  {settings.alamat}
                </p>
                {settings.mapsUrl && (
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center gap-1 text-[12.5px] font-bold text-brand hover:text-brand-dark"
                  >
                    Buka di Google Maps <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] text-muted">
          <span className="flex items-center gap-1.5">
            <BadgeCheck size={14} className="text-leaf" /> Produk bersertifikat halal
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-leaf" /> Pembayaran diverifikasi admin
          </span>
          <span className="flex items-center gap-1.5">
            <Store size={14} className="text-leaf" /> Toko fisik di Probolinggo
          </span>
        </div>
      </section>

      {promo && (
        <section className="container-page mt-3 md:mt-4">
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
              <p className="mt-0.5 line-clamp-2 text-[13.5px] font-extrabold leading-snug sm:truncate sm:text-[14px]">
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

      <section className="container-page mt-9 md:mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Kategori</p>
            <h2 className="mt-1.5 text-[23px] font-extrabold text-navy md:text-[28px]">
              Pilih kategori
            </h2>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
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

      <section className="container-page mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Paling dicari</p>
            <h2 className="mt-1.5 text-[23px] font-extrabold text-navy md:text-[28px]">
              Produk unggulan
            </h2>
          </div>
          <Link
            href="/katalog"
            className="flex min-h-11 flex-none items-center gap-1 whitespace-nowrap text-[13px] font-bold text-brand hover:text-brand-dark"
          >
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {tampil.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container-page mt-10 md:mt-14">
        <div className="rounded-[22px] border border-line bg-white p-5 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Cara pesan</p>
              <h2 className="mt-1.5 text-[22px] font-extrabold text-navy md:text-[26px]">
                Pesan dalam 4 langkah
              </h2>
            </div>
            <p className="max-w-[330px] text-[12.5px] leading-relaxed text-muted">
              Tidak perlu daftar akun. Cukup nama dan nomor HP saat checkout.
            </p>
          </div>

          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {[
              {
                judul: "Pilih produk",
                teks: "Cari atau telusuri kategori, lalu masukkan ke keranjang.",
              },
              {
                judul: "Isi data",
                teks: "Nama, nomor HP, dan pilih ambil di toko atau antar.",
              },
              {
                judul: "Bayar",
                teks: "Tunai di toko, QRIS, atau transfer bank.",
              },
              {
                judul: "Terima pesanan",
                teks: "Ambil sendiri atau ikuti kurir lewat halaman riwayat.",
              },
            ].map((step, i) => (
              <li key={step.judul} className="relative">
                {i < 3 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[26px] top-8 hidden h-[calc(100%-6px)] w-px border-l border-dashed border-[#C9E1F7] lg:block"
                  />
                )}
                <div className="flex gap-3">
                  <span className="relative z-10 flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full border border-[#C9E1F7] bg-mist text-sm font-extrabold text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[13.5px] font-bold text-navy">{step.judul}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{step.teks}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
