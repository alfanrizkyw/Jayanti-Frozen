import { Gambar } from "@/components/gambar";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bike,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  MapPin,
  MessageCircle,
  Search,
  Snowflake,
  Store,
  Truck,
} from "lucide-react";
import { getStorefront } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { rupiah, waLink } from "@/lib/format";

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
      <section className="container-page pt-4 md:pt-6">
        <div className="relative overflow-hidden rounded-[24px] bg-navy text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_0%_0%,rgba(114,185,238,0.22),transparent_60%)]"
          />
          <div className="relative grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="px-5 pb-5 pt-7 sm:px-8 sm:pb-8 sm:pt-9 lg:py-12 lg:pl-10 lg:pr-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/85">
                <Snowflake size={13} className="text-sky" />
                Frozen food · Kota Probolinggo
              </span>

              <h1 className="mt-4 text-[32px] font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-[42px] lg:text-[48px]">
                Frozen food,
                <br />
                <span className="text-sky">siap masak</span> kapan saja.
              </h1>
              <p className="mt-3.5 max-w-[430px] text-[14px] leading-relaxed text-white/72 sm:text-[15px]">
                Pilih produk, lalu ambil di toko atau minta diantar. Bayar
                tunai, QRIS, atau transfer.
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
                <button type="submit" className="btn btn-primary bg-sky px-4 text-navy hover:bg-[#8ac8f5] sm:px-5">
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

            <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[440px]">
              <Gambar
                src={gambarHero}
                alt="Aneka frozen food Yanti Frozen di atas es"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/25 lg:to-transparent" />

              {promo && (
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-white/95 p-3.5 shadow-lift backdrop-blur sm:inset-x-5 sm:bottom-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-brand">
                        {promo.badge || "Promo"}
                      </p>
                      <p className="mt-0.5 truncate text-[15px] font-extrabold text-navy">
                        {promo.judul}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">
                        {diskon > 0
                          ? `Diskon hingga ${diskon}% untuk produk pilihan`
                          : promo.deskripsi}
                      </p>
                    </div>
                    <Link
                      href={promo.cta || "/katalog"}
                      className="btn btn-navy btn-sm flex-none"
                    >
                      Lihat <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 grid overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-line md:mt-4">
          {[
            {
              icon: Snowflake,
              judul: "Selalu beku −18°C",
              teks: "Produk tetap beku sampai diterima.",
            },
            {
              icon: Truck,
              judul: "Ambil atau diantar",
              teks: "Ongkir jelas, gratis di atas " + rupiah(settings.gratisOngkirMin) + ".",
            },
            {
              icon: CreditCard,
              judul: "Tiga cara bayar",
              teks: "Tunai, QRIS, atau transfer bank.",
            },
          ].map(({ icon: Icon, judul, teks }) => (
            <div key={judul} className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-mist text-brand">
                <Icon size={18} strokeWidth={2.1} />
              </span>
              <div>
                <p className="text-[13px] font-bold text-navy">{judul}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{teks}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-9 md:mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Kategori</p>
            <h2 className="mt-1.5 text-[23px] font-extrabold text-navy md:text-[28px]">
              Pilih kategori
            </h2>
          </div>
          <Link
            href="/katalog"
            className="hidden items-center gap-1 text-[13px] font-bold text-brand hover:text-brand-dark sm:flex"
          >
            Semua produk <ChevronRight size={15} />
          </Link>
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
            className="flex items-center gap-1 pb-1 text-[13px] font-bold text-brand hover:text-brand-dark"
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
                teks: "Ambil sendiri atau ikuti kurir lewat halaman lacak.",
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

      <section className="container-page mt-8 md:mt-10">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] border border-[#C9E1F7] bg-mist px-5 py-5 sm:flex-row sm:items-center md:px-7">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white text-brand">
              <MessageCircle size={20} />
            </span>
            <div>
              <p className="text-[15px] font-extrabold text-navy">
                Butuh bantuan?
              </p>
              <p className="mt-0.5 text-[12.5px] text-navy/70">
                Chat WhatsApp toko. Dibalas langsung oleh admin.
              </p>
            </div>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <a
              href={waLink(settings.telepon, "Halo Yanti Frozen, saya mau bertanya produk.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1 sm:flex-none"
            >
              <MessageCircle size={16} /> WhatsApp toko
            </a>
            <Link href="/katalog" className="btn btn-outline flex-1 sm:flex-none">
              Lihat katalog
            </Link>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-5">
          <div className="flex items-start gap-2.5">
            <MapPin size={17} className="mt-0.5 flex-none text-brand" />
            <div>
              <p className="text-[13px] font-extrabold text-navy">Lokasi toko</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                {settings.alamat}
              </p>
            </div>
          </div>
          {settings.mapsUrl && (
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm flex-none"
            >
              Buka di Google Maps <ExternalLink size={13} />
            </a>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-muted">
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
    </>
  );
}
