import type { Metadata } from "next";
import { Gambar } from "@/components/gambar";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  CircleCheck,
  CreditCard,
  MessageCircle,
  Snowflake,
  Store,
  Truck,
} from "lucide-react";
import { getProductBySlug } from "@/lib/data";
import { BuyBox } from "@/components/buy-box";
import { ProductCard } from "@/components/product-card";
import { rupiah, waLink } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return { title: "Produk tidak ditemukan" };
  return {
    title: data.product.nama,
    description: data.product.deskripsi.slice(0, 155),
    openGraph: {
      title: data.product.nama,
      description: data.product.deskripsi.slice(0, 155),
      images: [data.product.gambar],
    },
  };
}

export default async function ProdukPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();

  const { product, related, settings } = data;
  const harga = product.hargaPromo ?? product.harga;
  const diskon = product.hargaPromo
    ? Math.round((1 - product.hargaPromo / product.harga) * 100)
    : 0;
  const habis = product.stok <= 0;

  return (
    <div className="container-page pt-5 md:pt-7">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[12px] text-muted">
        <Link href="/" className="hover:text-navy">Beranda</Link>
        <ChevronRight size={13} />
        <Link href="/katalog" className="hover:text-navy">Katalog</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-navy">{product.nama}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-9">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line bg-mist">
            <Gambar
              src={product.gambar}
              alt={product.nama}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className={`object-cover ${habis ? "opacity-60 grayscale" : ""}`}
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-navy/90 px-2.5 py-1.5 text-[10.5px] font-bold text-white backdrop-blur">
              <Snowflake size={12} className="text-sky" /> Beku −18°C
            </span>
            {diskon > 0 && (
              <span className="absolute right-3 top-3 rounded-lg bg-sun px-2.5 py-1.5 text-[11px] font-extrabold text-[#3D2400]">
                Hemat {diskon}%
              </span>
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Foto ilustrasi produk. Kemasan dapat berbeda sesuai stok.
          </p>

          <div className="mt-5 hidden gap-3 md:grid md:grid-cols-3">
            {[
              { icon: Snowflake, judul: "Tetap beku", teks: "Dikemas dengan ice gel" },
              { icon: Store, judul: "Siap diambil", teks: "Setelah dikonfirmasi admin" },
              { icon: Truck, judul: "Diantar", teks: `Ongkir ${rupiah(settings.ongkir)}` },
            ].map(({ icon: Icon, judul, teks }) => (
              <div key={judul} className="rounded-xl border border-line bg-white p-3.5">
                <Icon size={18} className="text-brand" />
                <p className="mt-2 text-[12.5px] font-bold text-navy">{judul}</p>
                <p className="mt-0.5 text-[11px] text-muted">{teks}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <p className="eyebrow">{product.kategori}</p>
          <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-navy md:text-[34px]">
            {product.nama}
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">Kemasan {product.satuan}</p>

          <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="stat-num text-[30px] font-extrabold leading-none text-navy">
              {rupiah(harga)}
            </span>
            {product.hargaPromo && (
              <>
                <span className="stat-num pb-0.5 text-[15px] text-muted line-through">
                  {rupiah(product.harga)}
                </span>
                <span className="mb-0.5 rounded-md bg-[#FFF4E3] px-2 py-1 text-[10.5px] font-bold text-[#8A520B]">
                  Hemat {rupiah(product.harga - product.hargaPromo)}
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {habis ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-[#EEF2F7] px-3 py-1.5 text-[11.5px] font-bold text-muted">
                Stok habis
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6E7DA] bg-leaf-soft px-3 py-1.5 text-[11.5px] font-bold text-leaf">
                <CircleCheck size={13} /> Stok tersedia {product.stok} pack
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11.5px] font-semibold text-navy">
              <Snowflake size={13} className="text-brand" /> Frozen food
            </span>
          </div>

          <p className="mt-4 text-[14px] leading-relaxed text-navy/80">
            {product.deskripsi}
          </p>

          <div className="mt-5">
            {habis ? (
              <a
                href={waLink(
                  settings.telepon,
                  `Halo, saya mau menanyakan ketersediaan ${product.nama}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full"
              >
                <MessageCircle size={17} /> Tanya ketersediaan
              </a>
            ) : (
              <BuyBox product={product} />
            )}
          </div>

          <dl className="mt-5 divide-y divide-line rounded-[16px] border border-line bg-white px-4">
            {[
              { icon: Store, k: "Ambil di toko", v: `${settings.alamat} · ${settings.jamBuka}` },
              { icon: Truck, k: "Antar ke rumah", v: `${settings.estimasiAntar} menit · gratis di atas ${rupiah(settings.gratisOngkirMin)}` },
              { icon: CreditCard, k: "Pembayaran", v: "Tunai, QRIS, atau transfer bank" },
              { icon: Snowflake, k: "Penyimpanan", v: "Simpan di freezer −18°C, jangan dicairkan ulang" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex items-start gap-3 py-3">
                <Icon size={16} className="mt-0.5 flex-none text-brand" />
                <div>
                  <dt className="text-[12.5px] font-bold text-navy">{k}</dt>
                  <dd className="mt-0.5 text-[12px] leading-relaxed text-muted">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[21px] font-extrabold text-navy md:text-[24px]">
              Produk lain di kategori ini
            </h2>
            <Link href="/katalog" className="text-[12.5px] font-bold text-brand hover:text-brand-dark">
              Lihat semua
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
