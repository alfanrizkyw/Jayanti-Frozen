"use client";

import { useState } from "react";
import { AlertCircle, Crosshair, Loader2 } from "lucide-react";
import { PetaPengantaran } from "./peta-pengantaran";

export interface TitikPilihan {
  lat: number;
  lng: number;
  akurasi?: number | null;
}

/**
 * Pemilih titik antar: satu klik pakai GPS HP, atau ketuk dan geser pin bila
 * lokasi HP kurang tepat. Titik akhir selalu ditentukan pembeli sendiri.
 */
export function PilihTitik({
  nilai,
  onPilih,
  tinggi,
}: {
  nilai: TitikPilihan | null;
  onPilih: (t: TitikPilihan) => void;
  tinggi?: string;
}) {
  const [gps, setGps] = useState<"idle" | "cari">("idle");
  const [pesan, setPesan] = useState("");
  const [gagal, setGagal] = useState(false);

  function pakaiLokasiSaya() {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGagal(true);
      setPesan("Perangkat ini tidak bisa membaca lokasi. Geser pin di peta.");
      return;
    }
    setGps("cari");
    setGagal(false);
    setPesan("");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const ketelitian = Number(p.coords.accuracy);
        setGps("idle");
        onPilih({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          akurasi: Number.isFinite(ketelitian) ? ketelitian : null,
        });
        setPesan(
          Number.isFinite(ketelitian) && ketelitian > 60
            ? `Sinyal GPS masih kasar (±${Math.round(ketelitian)} m). Geser pin ke atap rumah Anda.`
            : "",
        );
      },
      (err) => {
        setGps("idle");
        setGagal(true);
        setPesan(
          err.code === 1
            ? "Izin lokasi ditolak. Izinkan lewat pengaturan browser, atau geser pin di peta."
            : "Lokasi belum terbaca. Coba lagi di area terbuka, atau geser pin di peta.",
        );
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }

  const info = pesan
    ? pesan
    : nilai
      ? nilai.akurasi != null && nilai.akurasi > 0
        ? `Titik dari GPS · akurasi ±${Math.max(1, Math.round(nilai.akurasi))} m. Geser pin bila perlu.`
        : "Titik sudah diatur. Geser pin bila belum tepat."
      : "Tekan Pilih lokasi saya, atau ketuk peta untuk menandai titik.";

  return (
    <div className="mt-2.5">
      <PetaPengantaran
        tujuan={nilai ? { lat: nilai.lat, lng: nilai.lng } : null}
        onPilih={onPilih}
        tinggi={tinggi ?? "h-[210px] sm:h-[260px]"}
      />

      <div className="mt-2">
        <button
          type="button"
          onClick={pakaiLokasiSaya}
          disabled={gps === "cari"}
          className="btn btn-primary min-h-11 w-full justify-center"
        >
          {gps === "cari" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Crosshair size={16} />
          )}
          {gps === "cari" ? "Mencari lokasi…" : "Pilih lokasi saya"}
        </button>
      </div>

      <p
        role="status"
        className={`mt-1.5 flex items-start gap-1.5 text-[11px] leading-relaxed ${
          gagal ? "text-[#8F2E25]" : "text-muted"
        }`}
      >
        {gagal && <AlertCircle size={12} className="mt-0.5 flex-none" />}
        {info}
      </p>
    </div>
  );
}
