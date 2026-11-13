import { Gambar } from "./gambar";
import Link from "next/link";
import { AddToCart } from "./add-to-cart";
import { rupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const promo = product.hargaPromo;
  const diskon = promo
    ? Math.round((1 - promo / product.harga) * 100)
    : 0;
  const habis = product.stok <= 0;

  return (
    <article className="lift press group flex flex-col overflow-hidden rounded-[16px] border border-line bg-white shadow-card">
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-mist"
        aria-label={`Lihat ${product.nama}`}
      >
        <Gambar
          src={product.gambar}
          alt={product.nama}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            habis ? "opacity-45 grayscale" : ""
          }`}
        />
        {promo && !habis && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-sun px-2 py-1 text-[10px] font-extrabold leading-none text-[#3D2400] shadow-sm">
            −{diskon}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 md:p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand/75">
          {product.kategori}
        </p>
        <Link href={`/produk/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-navy md:text-[15px]">
            {product.nama}
          </h3>
        </Link>
        <p className="mt-0.5 text-[11.5px] text-muted">{product.satuan}</p>

        <div className="mt-auto pt-2.5">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="stat-num text-[15px] font-extrabold text-navy md:text-base">
              {rupiah(promo ?? product.harga)}
            </span>
            {promo && (
              <span className="stat-num text-[11px] font-medium text-muted line-through">
                {rupiah(product.harga)}
              </span>
            )}
          </div>
          {product.stok > 0 && product.stok <= 5 && (
            <p className="mt-0.5 text-[10.5px] font-semibold text-[#9A5B0B]">
              Sisa {product.stok} pack
            </p>
          )}
          <AddToCart product={product} className="mt-2.5" />
        </div>
      </div>
    </article>
  );
}
