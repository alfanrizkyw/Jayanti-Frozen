import Link from "next/link";
import { Snowflake } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-[430px] rounded-[22px] border border-line bg-white p-7 text-center shadow-card">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>
        <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-brand">
          <Snowflake size={26} />
        </span>
        <h1 className="mt-4 text-[22px] font-extrabold text-navy">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Tautan mungkin sudah berubah. Kembali ke beranda atau lacak pesanan
          Anda lewat kode.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/" className="btn btn-primary flex-1">Ke beranda</Link>
          <Link href="/lacak" className="btn btn-outline flex-1">Lacak pesanan</Link>
        </div>
      </div>
    </div>
  );
}
