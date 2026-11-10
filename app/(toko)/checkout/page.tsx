import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getSettings } from "@/lib/data";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <div className="container-page pt-5 md:pt-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-muted">
        <Link href="/" className="hover:text-navy">Beranda</Link>
        <ChevronRight size={13} />
        <Link href="/keranjang" className="hover:text-navy">Keranjang</Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-navy">Checkout</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-navy md:text-[32px]">Checkout</h1>
          <p className="mt-1 max-w-[460px] text-[13px] leading-relaxed text-muted">
            Isi data penerima dan pilih cara terima. Pesanan langsung masuk ke
            admin setelah Anda menekan buat pesanan.
          </p>
        </div>

        <ol className="hidden items-center gap-1 rounded-full border border-line bg-white px-1.5 py-1.5 text-[11px] font-semibold sm:flex">
          <li className="flex items-center gap-1 rounded-full px-2.5 py-1 text-muted">
            Keranjang
          </li>
          <ChevronRight size={12} className="text-line" />
          <li className="rounded-full bg-navy px-3 py-1.5 text-white">Checkout</li>
          <ChevronRight size={12} className="text-line" />
          <li className="flex items-center gap-1 rounded-full px-2.5 py-1 text-muted">
            Selesai
          </li>
        </ol>
      </div>

      <CheckoutForm settings={settings} />
    </div>
  );
}
