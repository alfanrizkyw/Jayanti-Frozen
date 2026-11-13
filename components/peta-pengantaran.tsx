"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { TrackMap } from "./track-map";
import type { HasilRute } from "@/lib/peta";

type Posisi = { lat: number; lng: number } | null;
type LModule = typeof import("leaflet");

const PENGUIN = `
<svg viewBox="0 0 84 84" width="80" height="80" aria-hidden="true">
  <g class="peta-pinguin">
    <ellipse cx="44" cy="77" rx="27" ry="3.6" fill="#0F2440" opacity="0.16"/>
    <path d="M24 66h16l14-14" fill="none" stroke="#1D4E86" stroke-width="7" stroke-linecap="round"/>
    <path d="M58 51 64 66" fill="none" stroke="#16304F" stroke-width="5" stroke-linecap="round"/>
    <path d="M55 45h12" fill="none" stroke="#16304F" stroke-width="5" stroke-linecap="round"/>
    <circle cx="24" cy="68" r="9.6" fill="#16304F"/>
    <circle cx="24" cy="68" r="3.8" fill="#B9CFE3"/>
    <circle cx="64" cy="68" r="9.6" fill="#16304F"/>
    <circle cx="64" cy="68" r="3.8" fill="#B9CFE3"/>
    <rect x="15" y="40" width="17" height="15" rx="3.2" fill="#C98A4B" stroke="#FFFFFF" stroke-width="1.6"/>
    <path d="M15 45h17M22 40v15" stroke="#F3E3CE" stroke-width="1.4"/>
    <ellipse cx="38" cy="43" rx="13" ry="16" fill="#122A4A" stroke="#FFFFFF" stroke-width="1.8"/>
    <ellipse cx="40" cy="46" rx="7.6" ry="11" fill="#F4F9FF"/>
    <circle cx="36" cy="24" r="10.5" fill="#122A4A" stroke="#FFFFFF" stroke-width="1.8"/>
    <ellipse cx="39" cy="25.5" rx="6.2" ry="7" fill="#F4F9FF"/>
    <circle cx="40.2" cy="24.4" r="1.5" fill="#122A4A"/>
    <path d="M46 27l7 2.4-7 3.2z" fill="#F2A93B"/>
    <path d="M47 41l9 6" fill="none" stroke="#122A4A" stroke-width="5.4" stroke-linecap="round"/>
    <path d="M32 58l-3 7" fill="none" stroke="#F2A93B" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M41 58l-1 7" fill="none" stroke="#F2A93B" stroke-width="3.4" stroke-linecap="round"/>
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
  labelTujuan = "Alamat Anda",
}: {
  kode: string;
  posisi: Posisi;
  progress: number;
  aktif: boolean;
  etaMenit: number;
  gpsAktif: boolean;
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
        doubleClickZoom: false,
        keyboard: false,
      });

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
          iconSize: [80, 80],
          iconAnchor: [40, 73],
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
          ? "Posisi GPS kurir diterima"
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
        role="img"
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
        <p className="pointer-events-none absolute bottom-2.5 left-3 rounded-md bg-white/90 px-2 py-1 text-[8px] font-semibold text-muted backdrop-blur sm:text-[9px]">
          {catatan}
        </p>
      )}
    </div>
  );
}
