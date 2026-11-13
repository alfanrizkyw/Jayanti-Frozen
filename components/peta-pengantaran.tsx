"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { TrackMap } from "./track-map";
import type { HasilRute } from "@/lib/peta";

type Posisi = { lat: number; lng: number } | null;
type LModule = typeof import("leaflet");

const PENGUIN = `
<svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pgBadan" x1="20" y1="10" x2="42" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4E81B0"/><stop offset="0.55" stop-color="#22476F"/><stop offset="1" stop-color="#0D2139"/>
    </linearGradient>
    <linearGradient id="pgPerut" x1="27" y1="23" x2="37" y2="41" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CFE2F2"/>
    </linearGradient>
    <linearGradient id="pgParuh" x1="38" y1="17" x2="44" y2="21" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFD274"/><stop offset="1" stop-color="#E4851F"/>
    </linearGradient>
    <linearGradient id="pgMotor" x1="14" y1="27" x2="52" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3E74A6"/><stop offset="0.55" stop-color="#1F4A75"/><stop offset="1" stop-color="#0C1F35"/>
    </linearGradient>
    <linearGradient id="pgKotak" x1="4" y1="26" x2="20" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#E6AD6D"/><stop offset="1" stop-color="#A5682E"/>
    </linearGradient>
    <radialGradient id="pgBan" cx="0.36" cy="0.32" r="0.74">
      <stop offset="0" stop-color="#5E7388"/><stop offset="0.62" stop-color="#2A3A4C"/><stop offset="1" stop-color="#0F1924"/>
    </radialGradient>
    <radialGradient id="pgKilau" cx="0.36" cy="0.26" r="0.72">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.45"/>
      <stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g class="peta-pinguin">
    <ellipse cx="32.5" cy="57.6" rx="22.5" ry="3" fill="#0F2440" opacity="0.2"/>

    <path d="M5.5 40.4h12.5" stroke="url(#pgMotor)" stroke-width="3.4" stroke-linecap="round"/>

    <rect x="3.5" y="25.5" width="16" height="14" rx="2.4" fill="url(#pgKotak)" stroke="#FFFFFF" stroke-width="1.2"/>
    <path d="M3.5 30.8h16M11.5 25.5v14" stroke="#F7E9D5" stroke-width="1.3" opacity="0.92"/>
    <rect x="3.5" y="25.5" width="16" height="4.2" rx="2.1" fill="#FFFFFF" opacity="0.16"/>

    <circle cx="17" cy="47" r="7.4" fill="url(#pgBan)"/>
    <circle cx="17" cy="47" r="2.9" fill="#C9DCEC"/>
    <circle cx="17" cy="47" r="1.1" fill="#7F98AE"/>

    <path d="M14 40.5h27.6l5.8-13.2" fill="none" stroke="url(#pgMotor)" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.8 27.4c3.2 1.6 4.9 4.7 5.2 9l.6 6.9" fill="none" stroke="url(#pgMotor)" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M45.6 26.2h7.8" stroke="#14304F" stroke-width="3.2" stroke-linecap="round"/>
    <circle cx="54.4" cy="26.2" r="1.5" fill="#F1A93D"/>

    <circle cx="50.5" cy="47" r="7.4" fill="url(#pgBan)"/>
    <circle cx="50.5" cy="47" r="2.9" fill="#C9DCEC"/>
    <circle cx="50.5" cy="47" r="1.1" fill="#7F98AE"/>
    <path d="M43.8 39.4c2.6-2.3 5.4-2.3 7.8 0" fill="none" stroke="#2B5F92" stroke-width="2.4" stroke-linecap="round"/>

    <path d="M27.6 41.6l-1.4 4" stroke="#F2A93B" stroke-width="3" stroke-linecap="round"/>
    <path d="M33.6 41.6l-.7 4" stroke="#F2A93B" stroke-width="3" stroke-linecap="round"/>

    <ellipse cx="30.2" cy="30.4" rx="9.6" ry="11.8" fill="url(#pgBadan)"/>
    <ellipse cx="32.2" cy="32.4" rx="5.8" ry="8.1" fill="url(#pgPerut)"/>
    <ellipse cx="27" cy="24.6" rx="4.2" ry="6.2" fill="url(#pgKilau)"/>

    <circle cx="31.4" cy="16.4" r="8" fill="url(#pgBadan)"/>
    <ellipse cx="34.1" cy="17.2" rx="4.8" ry="5.3" fill="url(#pgPerut)"/>
    <circle cx="35.6" cy="16" r="1.4" fill="#10263F"/>
    <circle cx="36.05" cy="15.55" r="0.48" fill="#FFFFFF"/>
    <path d="M38.4 17.4l5.4 1.9-5.2 2z" fill="url(#pgParuh)"/>
    <path d="M43.8 19.3l-3.4.1" stroke="#C46C15" stroke-width="0.7" stroke-linecap="round" opacity="0.7"/>

    <path d="M33.4 25.8l11 1.9" stroke="#1B3E63" stroke-width="4.2" stroke-linecap="round"/>
  </g>
</svg>`;

const IKON_TOKO = `
<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
  <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#2166AC" stroke-width="2.2"/>
  <path d="M9.5 13.5h13l-1.3-3.4H10.8z" fill="#2166AC"/>
  <rect x="10" y="13.5" width="12" height="7.5" rx="1.2" fill="#2166AC"/>
  <rect x="13" y="16.4" width="6" height="4.6" rx="0.9" fill="#ffffff"/>
</svg>`;

const IKON_TUJUAN = `
<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
  <circle cx="16" cy="16" r="14" fill="#ffffff" stroke="#2166AC" stroke-width="2.2"/>
  <path d="M16 8.5l7 6.2v8.3h-5.1v-4.4h-3.8v4.4H9v-8.3z" fill="#2166AC"/>
</svg>`;

function divIkon(L: LModule, html: string, ukuran: number, jangkar: number) {
  return L.divIcon({
    className: "peta-pin-ikon",
    html,
    iconSize: [ukuran, ukuran],
    iconAnchor: [ukuran / 2, jangkar],
  });
}

function indeksTerdekat(rute: [number, number][], titik: Posisi) {
  if (!titik || !rute.length) return 0;
  let best = 0;
  let jarak = Number.POSITIVE_INFINITY;
  for (let i = 0; i < rute.length; i++) {
    const d =
      (rute[i][0] - titik.lat) ** 2 + (rute[i][1] - titik.lng) ** 2;
    if (d < jarak) {
      jarak = d;
      best = i;
    }
  }
  return best;
}

function titikRute(rute: [number, number][], progres: number): Posisi {
  if (!rute.length) return null;
  const t = Math.min(0.999, Math.max(0, progres));
  const titik = rute[Math.floor(t * (rute.length - 1))];
  return { lat: titik[0], lng: titik[1] };
}

export function PetaPengantaran({
  kode,
  posisi,
  progress,
  aktif,
  etaMenit,
  gpsAktif,
  akurasi = null,
  labelTujuan = "Alamat Anda",
}: {
  kode: string;
  posisi: Posisi;
  progress: number;
  aktif: boolean;
  etaMenit: number;
  gpsAktif: boolean;
  akurasi?: number | null;
  labelTujuan?: string;
}) {
  const [rute, setRute] = useState<HasilRute | null>(null);
  const [status, setStatus] = useState<"muat" | "siap" | "gagal">("muat");
  const wadah = useRef<HTMLDivElement | null>(null);
  const peta = useRef<import("leaflet").Map | null>(null);
  const penanda = useRef<import("leaflet").Marker | null>(null);
  // Posisi awal dibaca lewat ref supaya peta tidak dibuat ulang tiap update GPS.
  const posisiRef = useRef(posisi);
  const progresRef = useRef(progress);
  posisiRef.current = posisi;
  progresRef.current = progress;

  useEffect(() => {
    const ctrl = new AbortController();
    setRute(null);
    setStatus("muat");
    fetch(`/api/rute/${encodeURIComponent(kode)}`, {
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || json?.fallback || !Array.isArray(json?.rute))
          throw new Error("Rute tidak tersedia");
        setRute(json as HasilRute);
        setStatus("siap");
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setStatus("gagal");
      });
    return () => ctrl.abort();
  }, [kode]);

  useEffect(() => {
    if (!rute || !wadah.current) return;
    let dibatalkan = false;
    let map: import("leaflet").Map | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (dibatalkan || !wadah.current) return;

      map = L.map(wadah.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: true,
        keyboard: false,
        touchZoom: true,
      });
      L.control.zoom({ position: "bottomright", zoomInTitle: "Perbesar peta", zoomOutTitle: "Perkecil peta" }).addTo(map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.polyline(rute.rute, {
        color: "#ffffff",
        weight: 9,
        opacity: 0.9,
        lineJoin: "round",
      }).addTo(map);
      const garis = L.polyline(rute.rute, {
        color: "#2166AC",
        weight: 4.5,
        opacity: 0.9,
        lineJoin: "round",
        dashArray: "1 7",
      }).addTo(map);

      L.marker([rute.toko.lat, rute.toko.lng], {
        icon: divIkon(L, IKON_TOKO, 32, 16),
        interactive: false,
        zIndexOffset: 400,
      }).addTo(map);
      if (rute.tujuan) {
        L.marker([rute.tujuan.lat, rute.tujuan.lng], {
          icon: divIkon(L, IKON_TUJUAN, 32, 16),
          interactive: false,
          zIndexOffset: 400,
        }).addTo(map);
      }

      const awal =
        posisiRef.current ??
        titikRute(rute.rute, progresRef.current) ??
        rute.toko;
      penanda.current = L.marker([awal.lat, awal.lng], {
        icon: L.divIcon({
          className: "peta-kurir-ikon",
          html: `<div class="peta-kurir">${PENGUIN}</div>`,
          iconSize: [54, 54],
          iconAnchor: [27, 48],
        }),
        interactive: false,
        zIndexOffset: 1000,
      }).addTo(map);

      if (rute.rute.length > 1) {
        map.fitBounds(garis.getBounds(), { padding: [26, 26] });
      } else {
        map.setView([rute.toko.lat, rute.toko.lng], 14);
      }
      window.setTimeout(() => map?.invalidateSize(), 120);
      peta.current = map;
    })();

    return () => {
      dibatalkan = true;
      penanda.current = null;
      peta.current = null;
      map?.remove();
      map = null;
    };
    // Cukup sekali per rute; pergerakan kurir ditangani efek di bawah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rute]);

  // Posisi kurir diperbarui tanpa membuat ulang peta.
  useEffect(() => {
    if (!rute || !penanda.current) return;
    const titik =
      posisi ??
      titikRute(rute.rute, progress) ??
      (rute.rute.length ? null : rute.toko);
    if (!titik) return;
    penanda.current.setLatLng([titik.lat, titik.lng]);
    if (rute.rute.length < 2) return;
    const el = penanda.current.getElement()
      ?.firstElementChild as HTMLElement | null;
    if (el) {
      const i = indeksTerdekat(rute.rute, titik);
      const depan = rute.rute[Math.min(rute.rute.length - 1, i + 2)];
      const barat = depan ? depan[1] < titik.lng : false;
      el.style.transform = barat ? "scaleX(-1)" : "";
    }
  }, [rute, posisi, progress]);

  const catatan = !rute
    ? ""
    : !rute.tujuan
      ? "Alamat belum ada di peta · kurir pakai navigasi alamat"
      : rute.presisi !== "alamat"
        ? "Titik alamat diperkirakan dari nama jalan/wilayah"
        : gpsAktif
          ? akurasi != null && akurasi > 0
            ? `Posisi GPS kurir · akurasi ±${Math.max(1, Math.round(akurasi))} m`
            : "Posisi GPS kurir diterima"
          : "Posisi diperkirakan dari waktu tempuh";

  if (status === "gagal") {
    return (
      <TrackMap
        progress={progress}
        aktif={aktif}
        etaMenit={etaMenit}
        gpsAktif={gpsAktif}
        labelTujuan={labelTujuan}
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line bg-[#E9F2F9]">
      <div
        ref={wadah}
        className="h-[240px] w-full sm:h-[290px]"
        role="region"
        aria-label={
          aktif
            ? `Peta perjalanan kurir dari toko menuju ${labelTujuan.toLowerCase()}`
            : "Rute pengantaran pesanan"
        }
      />

      {status === "muat" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E9F2F9] text-[11.5px] font-semibold text-muted">
          Menyiapkan peta…
        </div>
      )}

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-navy shadow-sm backdrop-blur">
        {aktif ? (
          <>
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-leaf" />
            KURIR DI JALAN
          </>
        ) : (
          <>
            <Navigation size={11} className="text-brand" />
            RUTE PENGANTARAN
          </>
        )}
      </div>

      <div className="pointer-events-none absolute right-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-right shadow-sm backdrop-blur sm:right-3 sm:top-3 sm:px-2.5 sm:py-1.5">
        <p className="hidden text-[9px] font-bold uppercase tracking-wide text-muted sm:block">
          Estimasi tiba
        </p>
        <p className="stat-num text-[11px] font-extrabold leading-tight text-navy sm:text-[13px]">
          {etaMenit > 0 ? `${etaMenit} menit` : "Tiba"}
        </p>
      </div>

      {catatan && (
        <p className="pointer-events-none absolute bottom-2.5 left-3 max-w-[calc(100%-68px)] rounded-md bg-white/90 px-2 py-1 text-[8px] font-semibold text-muted backdrop-blur sm:text-[9px]">
          {catatan}
        </p>
      )}
    </div>
  );
}
