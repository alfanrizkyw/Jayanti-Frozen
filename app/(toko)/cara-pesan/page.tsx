import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  CreditCard,
  LifeBuoy,
  ShoppingBag,
} from "lucide-react";
import { getStorefront } from "@/lib/data";
import { waLink } from "@/lib/format";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { CaraPesanDemo } from "@/components/cara-pesan-demo";

export const metadata: Metadata = {
  title: "Cara pesan",
  description:
    "Lima langkah memesan di Yanti Frozen: pilih produk, isi nama dan HP, tandai titik antar, pilih pembayaran, lalu ikuti kurir sampai pesanan tiba. Tanpa daftar akun.",
};

const LANGKAH = [
  {
    judul: "Pilih produk",
    teks: "Buka Katalog, lalu tekan Tambah pada produk yang diinginkan. Produk langsung masuk keranjang tanpa daftar akun.",
  },
  {
    judul: "Isi nama dan HP",
    teks: "Cukup nama dan nomor HP. Nomor ini dipakai admin untuk mengonfirmasi pesanan lewat WhatsApp.",
  },
  {
    judul: "Tandai titik antar",
    teks: "Pilih antar ke rumah atau ambil di toko. Untuk antar, tulis alamat lalu tekan Pilih lokasi saya dan geser pin bila titiknya meleset. Ongkir muncul di ringkasan.",
  },
  {
    judul: "Pilih pembayaran",
    teks: "Pesanan antar memakai QRIS atau transfer; tunai hanya untuk ambil di toko. Pesanan masuk setelah dikonfirmasi admin.",
  },
  {
    judul: "Ikuti kurir dan beri ulasan",
    teks: "Status dan posisi kurir tampil di halaman pesanan. Setelah selesai, beri bintang dan ulasan untuk toko.",
  },
];

export default async function CaraPesanPage() {
  const { settings } = await getStorefront();

  return (
    <div className="container-page pt-5 md:pt-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-[12px] text-muted"
      >
        <Link href="/" className="hover:text-navy">
          Beranda
        </Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-navy">Cara pesan</span>
      </nav>

      <div className="mt-3 max-w-[560px]">
        <h1 className="text-[28px] font-extrabold leading-tight text-navy md:text-[34px]">
          Cara pesan
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted md:text-[14px]">
          Tanpa daftar akun. Contoh di bawah berjalan sendiri seperti video;
          bisa dijeda, dan ada panah Kembali atau Selanjutnya kalau ingin
          pindah sendiri.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:mt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <CaraPesanDemo />

        <section aria-labelledby="langkah-lengkap" className="card p-4 md:p-5">
          <h2
            id="langkah-lengkap"
            className="text-[16px] font-extrabold text-navy"
          >
            Langkah lengkap
          </h2>
          <ol className="mt-3 space-y-1">
            {LANGKAH.map((l, i) => (
              <li
                key={l.judul}
                className="flex gap-3 rounded-xl px-1 py-2"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-mist text-[11.5px] font-extrabold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold leading-snug text-navy">
                    {l.judul}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                    {l.teks}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="card flex items-start gap-3 p-4">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
            <Clock size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-extrabold text-navy">Jam buka</p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              Setiap hari {settings.jamBuka}
            </p>
          </div>
        </div>

        <div className="card flex items-start gap-3 p-4">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
            <CreditCard size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-extrabold text-navy">Pembayaran</p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              Tunai untuk ambil di toko, QRIS, atau transfer.
            </p>
          </div>
        </div>

        <a
          href={waLink(
            settings.telepon,
            "Halo Yanti Frozen, saya mau bertanya cara pesan.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="card lift flex items-start gap-3 p-4"
        >
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-mist text-brand">
            <WhatsAppIcon size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-extrabold text-navy">Butuh bantuan?</p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              Chat langsung ke admin.
            </p>
          </div>
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row md:mt-6">
        <Link href="/katalog" className="btn btn-primary">
          <ShoppingBag size={17} /> Mulai belanja
        </Link>
        <Link href="/lacak" className="btn btn-outline">
          <LifeBuoy size={17} /> Buka riwayat pesanan
        </Link>
      </div>
    </div>
  );
}
