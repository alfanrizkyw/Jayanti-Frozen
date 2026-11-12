import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ErrorReporter } from "@/components/error-reporter";
import { PreferencesProvider } from "@/components/preferences";
import { AutoTranslate } from "@/components/auto-translate";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const skripPreferensi = `(function(){try{var t=localStorage.getItem("jayanti-tema");var tema=t==="dark"||t==="light"?t:"light";document.documentElement.dataset.theme=tema;var b=localStorage.getItem("jayanti-bahasa");document.documentElement.lang=b==="en"?"en":"id";}catch(e){}})();`;

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
    default: "Yanti Frozen — Frozen food siap masak",
    template: "%s · Yanti Frozen",
  },
  description:
    "Belanja frozen food di Yanti Frozen. Ambil di toko atau minta diantar, bayar tunai, QRIS, atau transfer. Lacak pesanan dengan kode pesanan.",
  openGraph: {
    title: "Yanti Frozen",
    description:
      "Frozen food siap masak. Ambil di toko atau minta diantar, lalu lacak pesanan dengan kode pesanan.",
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
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={jakarta.variable}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: skripPreferensi }} />
      </head>
      <body>
        <PreferencesProvider>
          <ErrorReporter />
          <AutoTranslate />
          {children}
        </PreferencesProvider>
      </body>
    </html>
  );
}
