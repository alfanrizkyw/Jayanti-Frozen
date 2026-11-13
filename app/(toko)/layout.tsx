import { AlertCircle } from "lucide-react";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MiniCart } from "@/components/mini-cart";
import { WelcomeIntro } from "@/components/welcome-intro";
import { AutoRefresh } from "@/components/auto-refresh";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <CartProvider>
      <SiteHeader />
      {!settings.tokoBuka && (
        <div role="status" className="border-b border-[#F0D9A8] bg-[#FEF8E9]">
          <div className="container-page flex items-start gap-2.5 py-2.5 text-[12px] leading-relaxed text-[#8A5207]">
            <AlertCircle size={15} className="mt-0.5 flex-none" />
            <p>
              <strong className="font-extrabold">Toko sedang tutup.</strong>{" "}
              {settings.tutupCatatan} Anda tetap bisa memesan untuk jadwal
              berikutnya dan membayar tunai saat pesanan diserahkan.
            </p>
          </div>
        </div>
      )}
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <MiniCart />
      <WelcomeIntro />
      <AutoRefresh detik={20} />
    </CartProvider>
  );
}
