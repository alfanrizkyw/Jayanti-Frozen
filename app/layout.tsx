import type { Metadata, Viewport } from "next";
import { ErrorReporter } from "@/components/error-reporter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"),
  ),
  title: {
    default: "Jayanti Frozen — Frozen food segar, praktis, lezat",
    template: "%s · Jayanti Frozen",
  },
  description:
    "Belanja frozen food di Jayanti Frozen. Pilih produk, ambil di toko atau antar kurir, bayar tunai, QRIS, atau transfer. Lacak kurir secara langsung.",
  openGraph: {
    title: "Jayanti Frozen",
    description:
      "Frozen food pilihan untuk keluarga. Ambil di toko atau antar kurir, dengan pelacakan pesanan langsung.",
    images: ["/brand/hero-promo.jpg"],
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#102B50",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <ErrorReporter />
        {children}
      </body>
    </html>
  );
}
