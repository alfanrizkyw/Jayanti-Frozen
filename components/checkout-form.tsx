"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Check,
  Clock,
  Landmark,
  Loader2,
  Lock,
  MapPin,
  QrCode,
  Snowflake,
  Store,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { rupiah } from "@/lib/format";
import type { PaymentMethod, Settings } from "@/lib/types";

export function CheckoutForm({ settings }: { settings: Settings }) {
  const { items, ready, subtotal, clear } = useCart();
  const router = useRouter();
  const tutup = !settings.tokoBuka;
  const slotJadwal = settings.jadwalKirim ?? [];
  const opsiJadwal = tutup ? slotJadwal : ["Secepatnya", ...slotJadwal];

  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [metode, setMetode] = useState<"ambil" | "antar">("antar");
  const [pembayaran, setPembayaran] = useState<PaymentMethod>("tunai");
  const [jadwal, setJadwal] = useState(opsiJadwal[0] ?? "");
  const [proses, setProses] = useState(false);
  const [error, setError] = useState("");

  const ongkir =
    metode === "ambil"
      ? 0
      : subtotal >= settings.gratisOngkirMin
        ? 0
        : settings.ongkir;
  const total = subtotal + ongkir;
  const rekeningTampil = settings.bank?.length
    ? settings.bank
    : settings.rekening
      ? [{ bank: "", nomor: settings.rekening, atasNama: settings.atasNama }]
      : [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!items.length) {
      setError("Keranjang masih kosong.");
      return;
    }
    if (!jadwal) {
      setError(tutup ? "Pilih jadwal kirim/ambil lebih dulu." : "Jadwal tidak tersedia.");
      return;
    }
    setProses(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          telepon,
          alamat: metode === "antar" ? alamat : "",
          catatan,
          metode,
          pembayaran: tutup ? "tunai" : pembayaran,
          jadwal: jadwal === "Secepatnya" ? "" : jadwal,
          items: items.map((i) => ({ id: i.id, jumlah: i.jumlah })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Pesanan gagal dibuat. Coba lagi.");
        setProses(false);
        return;
      }
      clear();
      router.push(`/pesanan/${json.kode}?baru=1`);
    } catch {
      setError("Jaringan sedang bermasalah. Periksa koneksi lalu coba lagi.");
      setProses(false);
    }
  }

  if (!ready) {
    return <div className="mt-6 h-[420px] animate-pulse rounded-2xl bg-white/70" />;
  }

  if (!items.length) {
    return (
      <div className="mt-6 rounded-[20px] border border-dashed border-[#C9E1F7] bg-white px-6 py-16 text-center">
        <h2 className="text-[18px] font-extrabold text-navy">Belum ada produk</h2>
        <p className="mt-1.5 text-[13px] text-muted">
          Tambahkan produk ke keranjang sebelum checkout.
        </p>
        <Link href="/katalog" className="btn btn-primary mt-5">
          Lihat katalog
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 grid gap-6 lg:grid-cols-[1.45fr_0.85fr] lg:items-start">
      <div className="space-y-4">
        {tutup && (
          <div className="rounded-[18px] border border-[#F0D9A8] bg-[#FEF8E9] p-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="mt-0.5 flex-none text-[#A97616]" />
              <div>
                <p className="text-[13.5px] font-extrabold text-[#7A540D]">
                  Toko sedang tutup
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#8A6A28]">
                  {settings.tutupCatatan}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#8A6A28]">
                  Pembayaran QRIS dan transfer belum bisa dilakukan. Pilih jadwal
                  kirim/ambil di bawah, lalu bayar tunai saat pesanan diserahkan.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-4 py-3 text-[13px] font-medium text-[#8F2E25]"
          >
            <AlertCircle size={17} className="mt-0.5 flex-none" />
            {error}
          </div>
        )}

        <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">1</span>
            <h2 className="text-[15px] font-extrabold text-navy">Data pembeli</h2>
          </div>
          <p className="mt-1.5 pl-9 text-[12px] text-muted">
            Nomor HP dipakai admin untuk mengonfirmasi pesanan.
          </p>

          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="nama" className="label">Nama lengkap</label>
              <input
                id="nama"
                className="field"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Siti Aisyah"
                autoComplete="name"
                required
                minLength={2}
              />
            </div>
            <div>
              <label htmlFor="telepon" className="label">Nomor HP / WhatsApp</label>
              <input
                id="telepon"
                className="field"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="0812 3456 7890"
                inputMode="tel"
                autoComplete="tel"
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">2</span>
            <h2 className="text-[15px] font-extrabold text-navy">Cara menerima</h2>
          </div>

          <fieldset className="mt-4">
            <legend className="sr-only">Metode penerimaan</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  value: "antar" as const,
                  icon: Truck,
                  judul: "Antar ke rumah",
                  teks: `Ongkir ${rupiah(settings.ongkir)} · gratis di atas ${rupiah(settings.gratisOngkirMin)}`,
                },
                {
                  value: "ambil" as const,
                  icon: Store,
                  judul: "Ambil di toko",
                  teks: "Gratis · siap setelah admin konfirmasi",
                },
              ].map((opsi) => {
                const Icon = opsi.icon;
                const aktif = metode === opsi.value;
                return (
                  <label
                    key={opsi.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                      aktif
                        ? "border-brand bg-mist ring-1 ring-brand/25"
                        : "border-line bg-white hover:border-[#B9D6F2]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metode"
                      className="sr-only"
                      checked={aktif}
                      onChange={() => setMetode(opsi.value)}
                    />
                    <span
                      className={`mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg ${
                        aktif ? "bg-brand text-white" : "bg-paper text-brand"
                      }`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-navy">
                        {opsi.judul}
                        {aktif && <Check size={13} className="text-brand" />}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                        {opsi.teks}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {metode === "antar" && (
            <div className="mt-4">
              <label htmlFor="alamat" className="label">Alamat pengantaran</label>
              <textarea
                id="alamat"
                className="field"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan, patokan…"
                autoComplete="street-address"
                required
                minLength={8}
              />
              <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted">
                <MapPin size={13} className="text-brand" />
                Kurir akan menghubungi nomor HP saat tiba.
              </p>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="jadwal" className="label">
              {tutup ? "Jadwal kirim / ambil" : "Jadwal (opsional)"}
            </label>
            <select
              id="jadwal"
              className="field"
              value={jadwal}
              onChange={(e) => setJadwal(e.target.value)}
              required={tutup}
            >
              {opsiJadwal.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
              {tutup
                ? "Toko sedang tutup, jadi pesanan diproses pada slot yang Anda pilih."
                : "Pilih Secepatnya, atau slot kirim/ambil yang tersedia."}
            </p>
          </div>

          {metode === "ambil" && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-paper p-3.5">
              <Snowflake size={16} className="mt-0.5 flex-none text-brand" />
              <p className="text-[12px] leading-relaxed text-muted">
                Ambil di <strong className="font-semibold text-navy">{settings.alamat}</strong>.
                Buka {settings.jamBuka}. Tunjukkan kode pesanan ke kasir.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">3</span>
            <h2 className="text-[15px] font-extrabold text-navy">Pembayaran</h2>
          </div>

          <fieldset className="mt-4">
            <legend className="sr-only">Metode pembayaran</legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  value: "tunai" as const,
                  icon: Banknote,
                  judul: "Tunai",
                  teks: "Bayar saat ambil atau saat kurir tiba",
                },
                {
                  value: "qris" as const,
                  icon: QrCode,
                  judul: "QRIS",
                  teks: "Scan kode QRIS dari admin",
                },
                {
                  value: "transfer" as const,
                  icon: Landmark,
                  judul: "Transfer",
                  teks: "Transfer bank, lalu konfirmasi",
                },
              ].map((opsi) => {
                const Icon = opsi.icon;
                const mati = tutup && opsi.value !== "tunai";
                const aktif = !mati && pembayaran === opsi.value;
                return (
                  <label
                    key={opsi.value}
                    className={`flex flex-col gap-1.5 rounded-xl border p-3 transition-colors ${
                      mati
                        ? "cursor-not-allowed border-line/70 bg-paper/60 opacity-60"
                        : aktif
                          ? "cursor-pointer border-brand bg-mist ring-1 ring-brand/25"
                          : "cursor-pointer border-line hover:border-[#B9D6F2]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pembayaran"
                      className="sr-only"
                      checked={aktif}
                      disabled={mati}
                      onChange={() => setPembayaran(opsi.value)}
                    />
                    <span className="flex items-center justify-between">
                      <Icon size={18} className={aktif ? "text-brand" : "text-navy/60"} />
                      {aktif && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      )}
                    </span>
                    <span className="text-[12.5px] font-bold text-navy">{opsi.judul}</span>
                    <span className="text-[10.5px] leading-relaxed text-muted">
                      {mati ? "Belum tersedia saat toko tutup" : opsi.teks}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {tutup && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#FEF8E9] px-3.5 py-3 text-[11.5px] leading-relaxed text-[#8A6A28]">
              <Lock size={14} className="mt-0.5 flex-none" />
              Toko sedang tutup, jadi pembayaran online belum bisa. Pesanan akan
              dijadwalkan dan dibayar tunai saat diserahkan.
            </p>
          )}

          {pembayaran === "transfer" && !tutup && (
            <div className="mt-3 space-y-2">
              {rekeningTampil.map((rek, i) => (
                <div
                  key={`${rek.bank}-${rek.nomor}-${i}`}
                  className="rounded-xl border border-[#C9E1F7] bg-mist px-3.5 py-3 text-[12px] leading-relaxed text-navy/80"
                >
                  <p className="font-bold text-navy">
                    {rek.bank ? `${rek.bank} · ` : ""}
                    {rek.nomor}
                  </p>
                  <p>a.n. {rek.atasNama}</p>
                </div>
              ))}
              <p className="rounded-xl bg-paper px-3.5 py-3 text-[11px] leading-relaxed text-muted">
                Cantumkan kode pesanan di berita transfer. Admin akan memverifikasi.
              </p>
            </div>
          )}
          {pembayaran === "qris" && !tutup && (
            <div className="mt-3 rounded-xl border border-line bg-white px-3.5 py-3.5 text-center">
              {settings.qrisGambar ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.qrisGambar}
                    alt={`Kode QRIS ${settings.qrisNama}`}
                    className="mx-auto h-auto w-[220px] max-w-full rounded-lg bg-white object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="mt-2 text-[12.5px] font-extrabold text-navy">
                    {settings.qrisNama}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                    Scan dengan aplikasi bank atau e-wallet, lalu bayar{" "}
                    <strong className="font-bold text-navy">{rupiah(total)}</strong>.
                  </p>
                </>
              ) : (
                <p className="flex items-start gap-2 text-left text-[11.5px] leading-relaxed text-muted">
                  <QrCode size={14} className="mt-0.5 flex-none text-brand" />
                  Gambar QRIS belum diatur toko. Pilih tunai atau transfer, atau
                  hubungi admin lewat WhatsApp.
                </p>
              )}
            </div>
          )}
          {pembayaran === "tunai" && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-paper px-3.5 py-3 text-[11.5px] leading-relaxed text-muted">
              <Banknote size={14} className="mt-0.5 flex-none text-brand" />
              Siapkan uang tunai; kurir tidak selalu membawa kembalian.
            </p>
          )}
        </section>

        <section className="rounded-[18px] border border-line bg-white p-4 md:p-5">
          <label htmlFor="catatan" className="text-[13.5px] font-bold text-navy">
            Catatan pesanan <span className="font-medium text-muted">(opsional)</span>
          </label>
          <textarea
            id="catatan"
            className="field mt-2"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: pisahkan kantong beku, titip di satpam, jangan dibel…"
            maxLength={280}
          />
          <p className="mt-1.5 text-right text-[10.5px] text-muted">{catatan.length}/280</p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-[120px]">
        <div className="rounded-[18px] border border-line bg-white p-4 shadow-card">
          <h2 className="text-[14px] font-extrabold text-navy">Ringkasan pesanan</h2>

          <ul className="mt-3 max-h-[270px] space-y-2.5 overflow-y-auto pr-0.5">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-2.5">
                <div className="relative h-11 w-11 flex-none overflow-hidden rounded-lg border border-line bg-mist">
                  <Image src={item.gambar} alt="" fill sizes="44px" className="object-cover" />
                  <span className="stat-num absolute bottom-0 right-0 rounded-tl bg-navy/85 px-1 text-[9px] font-bold text-white">
                    {item.jumlah}×
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-navy">{item.nama}</p>
                  <p className="text-[10.5px] text-muted">{item.satuan}</p>
                </div>
                <span className="stat-num text-[11.5px] font-bold text-navy">
                  {rupiah(item.harga * item.jumlah)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-2 border-t border-line pt-3 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="stat-num font-semibold text-navy">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">
                Ongkir {metode === "ambil" ? "(ambil sendiri)" : ""}
              </dt>
              <dd className="stat-num font-semibold text-navy">
                {ongkir === 0 ? (
                  <span className="text-leaf">Gratis</span>
                ) : (
                  rupiah(ongkir)
                )}
              </dd>
            </div>
            {metode === "antar" && ongkir === 0 && subtotal > 0 && (
              <p className="rounded-lg bg-leaf-soft px-2.5 py-2 text-[10.5px] font-semibold text-leaf">
                Gratis ongkir karena belanja ≥ {rupiah(settings.gratisOngkirMin)}
              </p>
            )}
          </dl>

          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-[13px] font-bold text-navy">Total bayar</span>
            <span className="stat-num text-[21px] font-extrabold text-navy">{rupiah(total)}</span>
          </div>

          <button type="submit" disabled={proses} className="btn btn-primary mt-4 w-full" aria-busy={proses}>
            {proses ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Memproses…
              </>
            ) : (
              <>
                <Lock size={15} /> {tutup ? "Jadwalkan pesanan" : "Buat pesanan"}
              </>
            )}
          </button>

          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-muted">
            <Clock size={12} />{" "}
            {tutup
              ? `Diproses saat toko buka · ${settings.jamBuka}`
              : "Dikonfirmasi admin pada jam operasional"}
          </p>

          <Link
            href="/keranjang"
            className="mt-3 flex min-h-10 items-center justify-center gap-1.5 text-[12px] font-semibold text-muted hover:text-navy"
          >
            <ArrowLeft size={13} /> Kembali ke keranjang
          </Link>
        </div>
      </aside>
    </form>
  );
}
