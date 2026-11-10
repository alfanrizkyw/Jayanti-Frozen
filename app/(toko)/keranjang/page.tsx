import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSettings } from "@/lib/data";
import { CartView } from "@/components/cart-view";

export const metadata = { title: "Keranjang" };

export default async function KeranjangPage() {
  const settings = await getSettings();

  return (
    <div className="container-page pt-5 md:pt-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-muted">
        <Link href="/" className="hover:text-navy">Beranda</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-navy">Keranjang</span>
      </nav>
      <div className="mt-3">
        <h1 className="text-[26px] font-extrabold text-navy md:text-[32px]">
          Keranjang belanja
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          Periksa jumlah produk sebelum melanjutkan ke checkout.
        </p>
      </div>

      <CartView settings={settings} />
    </div>
  );
}
