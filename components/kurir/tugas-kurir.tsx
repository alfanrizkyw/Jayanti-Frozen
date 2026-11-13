"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock3,
  Copy,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  Phone,
} from "lucide-react";
import { PetaPengantaran } from "@/components/peta-pengantaran";
import { jam, salinTeks, teleponRapi, waLink } from "@/lib/format";
import type { TugasKurir } from "@/lib/tugas-kurir";

type GeoState = "idle" | "mencari" | "aktif" | "ditolak" | "gagal";

export function TugasKurirBoard({ tugas }: { tugas: TugasKurir }) {
  const [geo, setGeo] = useState<GeoState>("idle");
  const [posisi, setPosisi] = useState<{ lat: number; lng: number; at: number } | null>(
    null,
  );
  const [akurasi, setAkurasi] = useState<number | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [unggah, setUnggah] = useState<"idle" | "proses" | "siap" | "gagal">("idle");
  const [pesanFoto, setPesanFoto] = useState("");
  const [proses, setProses] = useState(false);
  const [selesai, setSelesai] = useState(false);
  const [error, setError] = useState("");
  const [tersalin, setTersalin] = useState(false);
  const inputFoto = useRef<HTMLInputElement | null>(null);
  const watch = useRef<number | null>(null);
  const kirimTerakhir = useRef(0);

  const titikPelanggan =
    tugas.lat != null && tugas.lng != null ? { lat: tugas.lat, lng: tugas.lng } : null;
  const alamatPeta = titikPelanggan
    ? `${titikPelanggan.lat},${titikPelanggan.lng}`
    : encodeURIComponent(tugas.alamat);

  const hentikanLacak = useCallback(() => {
    if (watch.current !== null) {
      navigator.geolocation.clearWatch(watch.current);
      watch.current = null;
    }
    setGeo("idle");
    setAkurasi(null);
  }, []);

  const mulaiLacak = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeo("gagal");
      return;
    }
    if (watch.current !== null) return;
    setGeo("mencari");
    watch.current = navigator.geolocation.watchPosition(
      (p) => {
        const at = Date.now();
        const ketelitian = Number(p.coords.accuracy);
        setPosisi({ lat: p.coords.latitude, lng: p.coords.longitude, at });
        setAkurasi(Number.isFinite(ketelitian) ? ketelitian : null);
        setGeo("aktif");
        // Titik yang masih kasar jangan dikirim ke pembeli; tunggu GPS mengunci.
        const layak = !Number.isFinite(ketelitian) || ketelitian <= 250;
        if (layak && at - kirimTerakhir.current > 5000) {
          kirimTerakhir.current = at;
          fetch(`/api/antar/${tugas.token}/lokasi`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: p.coords.latitude,
              lng: p.coords.longitude,
            }),
          }).catch(() => {});
        }
      },
      (err) => {
        if (watch.current !== null) {
          navigator.geolocation.clearWatch(watch.current);
          watch.current = null;
        }
        setGeo(err.code === 1 ? "ditolak" : "gagal");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }, [tugas.token]);

  // Lokasi dibagikan otomatis selama tugas aktif, tanpa tombol.
  useEffect(() => {
    mulaiLacak();
    return () => hentikanLacak();
  }, [mulaiLacak, hentikanLacak]);

  // Izin lokasi atau sinyal bisa pulih sendiri; coba lagi tanpa perlu ditekan.
  useEffect(() => {
    if (geo === "aktif" || geo === "mencari") return;
    const timer = window.setTimeout(
      () => mulaiLacak(),
      geo === "ditolak" ? 15000 : 8000,
    );
    return () => window.clearTimeout(timer);
  }, [geo, mulaiLacak]);

  useEffect(() => {
    const segarkan = () => {
      if (document.visibilityState === "visible") mulaiLacak();
    };
    document.addEventListener("visibilitychange", segarkan);
    return () => document.removeEventListener("visibilitychange", segarkan);
  }, [mulaiLacak]);

  useEffect(() => {
    return () => {
      if (foto) URL.revokeObjectURL(foto);
    };
  }, [foto]);

  async function pilihFoto(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPesanFoto("Pilih file foto (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPesanFoto("Ukuran foto maksimal 10 MB.");
      return;
    }

    setFoto((lama) => {
      if (lama) URL.revokeObjectURL(lama);
      return URL.createObjectURL(file);
    });
    setUnggah("proses");
    setPesanFoto("Mengunggah foto bukti…");

    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`/api/antar/${tugas.token}/bukti`, {
        method: "POST",
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Foto gagal diunggah.");
      setUnggah("siap");
      setPesanFoto("Foto bukti tersimpan. Pesanan siap ditandai diterima.");
    } catch (err) {
      setUnggah("gagal");
      setPesanFoto(err instanceof Error ? err.message : "Foto gagal diunggah.");
    }
  }

  async function tutupTugas() {
    if (unggah !== "siap") {
      setError("Ambil dan unggah foto bukti barang diterima dulu.");
      return;
    }
    setProses(true);
    setError("");
    try {
      const res = await fetch(`/api/antar/${tugas.token}/selesai`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Gagal menutup tugas.");
      hentikanLacak();
      setSelesai(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menutup tugas.");
    } finally {
      setProses(false);
    }
  }

  async function salin(alamat: string) {
    if (await salinTeks(alamat)) {
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1600);
    } else {
      setError("Alamat tidak bisa disalin. Silakan salin manual.");
    }
  }

  if (selesai) {
    return (
      <section className="card flex flex-col items-center px-5 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-soft text-leaf">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-4 text-[19px] font-extrabold text-navy">
          Pesanan sudah diantar
        </h1>
        <p className="mt-1.5 max-w-[340px] text-[12.5px] leading-relaxed text-muted">
          Terima kasih. Pesanan {tugas.kode} sudah ditutup dan link tugas ini
          tidak bisa dipakai lagi.
        </p>
      </section>
    );
  }

  const etaMenit = (() => {
    if (!tugas.mulai) return tugas.estimasiMenit;
    const menit = (Date.now() - new Date(tugas.mulai).getTime()) / 60000;
    return Math.max(0, Math.ceil((tugas.estimasiMenit || 20) - menit));
  })();

  return (
    <div className="space-y-3.5">
      <div>
        <p className="eyebrow">Tugas antar</p>
        <h1 className="mt-1 text-[22px] font-extrabold text-navy md:text-[27px]">
          {tugas.kode}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
          <Clock3 size={13} />
          {tugas.mulai ? `Mulai ${jam(tugas.mulai)} · ` : ""}
          estimasi {tugas.estimasiMenit} menit
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3.5 py-2.5 text-[11.5px] text-[#8F2E25]"
        >
          <AlertCircle size={14} className="mt-0.5 flex-none" /> {error}
        </div>
      )}

      {geo !== "aktif" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-[#F3DFBC] bg-[#FFF4E3] px-3.5 py-3"
        >
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-[#8A520B]">
            <MapPin size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-extrabold text-[#8A520B]">
              {geo === "ditolak"
                ? "Izin lokasi diblokir"
                : geo === "gagal"
                  ? "GPS belum dapat sinyal"
                  : "Wajib bagikan lokasi"}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#8A520B]/85">
              {geo === "ditolak"
                ? "Buka ikon gembok di bilah alamat, izinkan Lokasi untuk situs ini. Pelacakan menyala sendiri, tidak perlu menekan tombol."
                : geo === "gagal"
                  ? "Pindah ke area terbuka. Sistem menyambung ulang sendiri dan langsung mengirim posisi tanpa klik."
                  : "Peramban meminta izin lokasi sekali. Pilih Izinkan; setelah itu posisi terkirim otomatis tanpa menekan tombol."}
            </p>
          </div>
        </div>
      )}

      <section className="overflow-hidden rounded-[18px] border border-brand/25 bg-white shadow-lift">
        <div className="flex flex-wrap items-center gap-2 bg-navy px-4 py-3 text-white">
          <span className="live-dot h-2 w-2 rounded-full bg-[#7EE0BC]" />
          <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-sky">
            Sedang diantar
          </p>
          <p className="ml-auto text-[12px] font-bold">{tugas.kode}</p>
        </div>

        <div className="space-y-3.5 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-mist text-[12px] font-extrabold text-brand">
              {tugas.pelanggan
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold text-navy">{tugas.pelanggan}</p>
              <p className="text-[11.5px] text-muted">{teleponRapi(tugas.telepon)}</p>
            </div>
            <div className="flex gap-1.5">
              <a
                href={`tel:${tugas.telepon}`}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-navy hover:bg-mist"
                aria-label={`Telepon ${tugas.pelanggan}`}
              >
                <Phone size={17} />
              </a>
              <a
                href={waLink(
                  tugas.telepon,
                  `Halo ${tugas.pelanggan}, saya kurir Yanti Frozen, pesanan ${tugas.kode} sedang saya antar.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-leaf hover:bg-leaf-soft"
                aria-label={`WhatsApp ${tugas.pelanggan}`}
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper/60 p-3">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted">
              Alamat pengantaran
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-[13px] font-semibold leading-relaxed text-navy">
              <MapPin size={15} className="mt-0.5 flex-none text-brand" />
              {tugas.alamat}
            </p>
            <p
              className={`mt-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold ${
                titikPelanggan ? "text-leaf" : "text-[#8A520B]"
              }`}
            >
              <MapPin size={12} />
              {titikPelanggan
                ? "Titik peta sudah dipasang pembeli"
                : "Titik peta belum diatur · pakai navigasi alamat"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${alamatPeta}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy"
              >
                <Navigation size={16} /> Buka navigasi
              </a>
              <button
                type="button"
                onClick={() => salin(tugas.alamat)}
                className="btn btn-outline"
              >
                {tersalin ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {tersalin ? "Tersalin" : "Salin alamat"}
              </button>
            </div>
          </div>

          {titikPelanggan ? (
            <PetaPengantaran
              tujuan={titikPelanggan}
              posisi={posisi ? { lat: posisi.lat, lng: posisi.lng } : null}
              akurasi={akurasi}
              aktif
              etaMenit={etaMenit}
              labelTujuan="Titik pelanggan"
            />
          ) : (
            <p className="rounded-xl border border-[#F3DFBC] bg-[#FFF9EF] px-3 py-2.5 text-[11.5px] leading-relaxed text-[#8A520B]">
              Pembeli belum memasang titik peta. Gunakan tombol buka navigasi di
              atas, lalu ikuti alamat yang tertulis.
            </p>
          )}

          <div className="rounded-xl border border-line bg-white px-3 py-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
              <PackageCheck size={12} /> Isi pesanan ·{" "}
              {tugas.items.reduce((n, i) => n + i.jumlah, 0)} item
            </p>
            <ul className="mt-1.5 space-y-1">
              {tugas.items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-baseline justify-between gap-2 text-[12px] text-navy"
                >
                  <span className="min-w-0 truncate">{i.nama}</span>
                  <span className="flex-none font-bold">
                    {i.jumlah}× {i.satuan}
                  </span>
                </li>
              ))}
            </ul>
            {tugas.catatan && (
              <p className="mt-2 rounded-lg bg-[#FFF4E3] px-2.5 py-2 text-[11px] leading-relaxed text-[#8A520B]">
                Catatan pembeli: “{tugas.catatan}”
              </p>
            )}
          </div>

          <StatusLokasi state={geo} posisi={posisi} akurasi={akurasi} />

          <div
            className={`rounded-xl border p-3 ${
              unggah === "siap"
                ? "border-[#C6E7DA] bg-leaf-soft"
                : "border-[#F3DFBC] bg-[#FFF9EF]"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  <Camera size={12} /> Foto bukti diterima · wajib
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  Foto barang yang diserahkan ke pelanggan. Pesanan tidak bisa
                  ditandai selesai tanpa foto ini.
                </p>
              </div>
              {unggah === "siap" && (
                <CheckCircle2 size={18} className="flex-none text-leaf" />
              )}
            </div>

            {foto && (
              <div className="mt-2 overflow-hidden rounded-lg border border-line bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto}
                  alt="Pratinjau foto bukti pengantaran"
                  className="h-auto max-h-[240px] w-full object-cover"
                />
              </div>
            )}

            {pesanFoto && (
              <p
                role="status"
                className={`mt-1.5 text-[11px] font-semibold ${
                  unggah === "gagal"
                    ? "text-[#8F2E25]"
                    : unggah === "siap"
                      ? "text-leaf"
                      : "text-muted"
                }`}
              >
                {pesanFoto}
              </p>
            )}

            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              aria-label="Pilih foto bukti pengantaran"
              onChange={(e) => {
                void pilihFoto(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputFoto.current?.click()}
              disabled={unggah === "proses"}
              className="btn btn-outline mt-2 w-full"
            >
              {unggah === "proses" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Camera size={15} />
              )}
              {unggah === "siap"
                ? "Ganti foto bukti"
                : unggah === "proses"
                  ? "Mengunggah…"
                  : "Ambil / pilih foto bukti"}
            </button>
          </div>

          <button
            type="button"
            onClick={tutupTugas}
            disabled={proses || unggah !== "siap"}
            className="btn btn-primary btn-lg w-full"
          >
            {proses ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <CheckCircle2 size={17} />
            )}
            Pesanan sudah diantar
          </button>
          {unggah !== "siap" && (
            <p className="text-center text-[10.5px] text-muted">
              Ambil foto bukti dulu untuk mengaktifkan tombol ini.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusLokasi({
  state,
  posisi,
  akurasi,
}: {
  state: GeoState;
  posisi: { lat: number; lng: number; at: number } | null;
  akurasi: number | null;
}) {
  if (state === "aktif") {
    return (
      <div className="rounded-xl border border-[#C6E7DA] bg-leaf-soft px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="live-dot h-2 w-2 rounded-full bg-leaf" />
          <p className="text-[12px] font-extrabold text-leaf">
            Lokasi Anda dibagikan otomatis
          </p>
        </div>
        <p className="mt-1 text-[10.5px] leading-relaxed text-leaf/80">
          {posisi
            ? `Diperbarui ${jam(
                new Date(posisi.at).toISOString(),
              )}${akurasi ? ` · akurasi ±${Math.max(1, Math.round(akurasi))} m` : ""}`
            : "Menunggu sinyal GPS pertama…"}
        </p>
      </div>
    );
  }

  if (state === "ditolak") {
    return (
      <div className="rounded-xl border border-[#F5CFCB] bg-[#FDF2F1] px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#8F2E25]">
          <Navigation size={13} /> Izin lokasi ditolak
        </p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#8F2E25]/80">
          Buka pengaturan peramban, izinkan lokasi untuk situs ini. Pembagian
          lokasi menyala sendiri setelah izin diberikan.
        </p>
      </div>
    );
  }

  if (state === "gagal") {
    return (
      <div className="rounded-xl border border-[#F3DFBC] bg-[#FFF4E3] px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#8A520B]">
          <Navigation size={13} /> GPS belum tersedia
        </p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#8A520B]/80">
          Sistem mencari sinyal lagi sendiri. Pelanggan tetap bisa melihat status
          pesanan.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-paper/70 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Loader2 size={13} className="animate-spin text-brand" />
        <p className="text-[12px] font-bold text-navy">Menyambungkan GPS…</p>
      </div>
      <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
        Lokasi dibagikan otomatis selama tugas antar. Tidak perlu menekan tombol
        apa pun.
      </p>
    </div>
  );
}
