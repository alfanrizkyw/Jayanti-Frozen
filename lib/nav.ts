import {
  BookOpenText,
  History,
  House,
  LayoutGrid,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export type NavTab = {
  href: string;
  label: string;
  Ikon: LucideIcon;
  aria?: string;
  utama?: boolean;
  cocok: (pathname: string) => boolean;
};

export const NAV_TABS: NavTab[] = [
  {
    href: "/",
    label: "Beranda",
    Ikon: House,
    cocok: (p) => p === "/",
  },
  {
    href: "/katalog",
    label: "Katalog",
    Ikon: LayoutGrid,
    cocok: (p) => p.startsWith("/katalog") || p.startsWith("/produk"),
  },
  {
    href: "/keranjang",
    label: "Keranjang",
    Ikon: ShoppingBag,
    aria: "Keranjang belanja",
    utama: true,
    cocok: (p) => p.startsWith("/keranjang") || p.startsWith("/checkout"),
  },
  {
    href: "/cara-pesan",
    label: "Cara pesan",
    Ikon: BookOpenText,
    cocok: (p) => p.startsWith("/cara-pesan"),
  },
  {
    href: "/lacak",
    label: "Riwayat",
    Ikon: History,
    aria: "Riwayat pesanan",
    cocok: (p) => p.startsWith("/lacak") || p.startsWith("/pesanan"),
  },
];
