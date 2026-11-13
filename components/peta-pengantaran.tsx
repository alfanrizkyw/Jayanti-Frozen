"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

type Posisi = { lat: number; lng: number } | null;
type LModule = typeof import("leaflet");

const PUSAT: [number, number] = [-7.7441, 113.2158];

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

const PIN_TUJUAN = `
<svg viewBox="0 0 36 44" width="36" height="44" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="18" cy="41.4" rx="7" ry="2.3" fill="#0F2440" opacity="0.18"/>
  <path d="M18 2.4c-7.2 0-13 5.7-13 12.8 0 9.4 13 26.2 13 26.2s13-16.8 13-26.2c0-7.1-5.8-12.8-13-12.8Z" fill="#2166AC" stroke="#FFFFFF" stroke-width="2.4"/>
  <circle cx="18" cy="15.2" r="4.8" fill="#FFFFFF"/>
</svg>`;

function divIkon(L: LModule, html: string, lebar: number, tinggi: number, jangkar: number) {
  return L.divIcon({
    className: "peta-pin-ikon",
    html,
    iconSize: [lebar, tinggi],
    iconAnchor: [lebar / 2, jangkar],
  });
}

/**
 * Peta pengantaran tanpa garis rute: hanya titik pelanggan dan posisi kurir
 * yang dikirim GPS. Bila `onPilih` diisi, peta berubah menjadi pemilih titik
 * dengan pin yang bisa digeser atau diketuk.
 */
export function PetaPengantaran({
  tujuan,
  posisi = null,
  akurasi = null,
  aktif = false,
  etaMenit = null,
  labelTujuan = "Titik pelanggan",
  onPilih,
  tinggi = "h-[240px] sm:h-[290px]",
}: {
  tujuan: Posisi;
  posisi?: Posisi;
  akurasi?: number | null;
  aktif?: boolean;
  etaMenit?: number | null;
  labelTujuan?: string;
  onPilih?: (t: { lat: number; lng: number }) => void;
  tinggi?: string;
}) {
  const pilih = Boolean(onPilih);
  const [siap, setSiap] = useState(false);
  const wadah = useRef<HTMLDivElement | null>(null);
  const petaRef = useRef<import("leaflet").Map | null>(null);
  const lRef = useRef<LModule | null>(null);
  const titikRef = useRef<import("leaflet").Marker | null>(null);
  const kurirRef = useRef<import("leaflet").Marker | null>(null);
  const lingkarRef = useRef<import("leaflet").Circle | null>(null);
  const kurirPas = useRef(false);
  const onPilihRef = useRef(onPilih);
  onPilihRef.current = onPilih;

  useEffect(() => {
    let batal = false;
    let map: import("leaflet").Map | null = null;
    titikRef.current = null;
    kurirRef.current = null;
    lingkarRef.current = null;
    kurirPas.current = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (batal || !wadah.current) return;
      lRef.current = L;

      map = L.map(wadah.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: true,
        keyboard: false,
        touchZoom: true,
      });
      L.control
        .zoom({
          position: "bottomright",
          zoomInTitle: "Perbesar peta",
          zoomOutTitle: "Perkecil peta",
        })
        .addTo(map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on("click", (e) => {
        onPilihRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      map.setView(PUSAT, pilih ? 14 : 13);
      petaRef.current = map;
      setSiap(true);
      window.setTimeout(() => map?.invalidateSize(), 120);
    })();

    return () => {
      batal = true;
      titikRef.current = null;
      kurirRef.current = null;
      lingkarRef.current = null;
      petaRef.current = null;
      lRef.current = null;
      map?.remove();
      map = null;
    };
  }, [pilih]);

  // Titik pelanggan dan kurir digambar ulang tanpa membuat peta baru.
  useEffect(() => {
    const L = lRef.current;
    const map = petaRef.current;
    if (!siap || !L || !map) return;

    if (tujuan) {
      if (!titikRef.current) {
        titikRef.current = L.marker([tujuan.lat, tujuan.lng], {
          icon: divIkon(L, PIN_TUJUAN, 36, 44, 41),
          draggable: pilih,
          keyboard: false,
          zIndexOffset: 700,
        }).addTo(map);
        if (pilih) {
          titikRef.current.on("dragend", () => {
            const p = titikRef.current?.getLatLng();
            if (p) onPilihRef.current?.({ lat: p.lat, lng: p.lng });
          });
        }
      } else {
        const p = titikRef.current.getLatLng();
        if (
          Math.abs(p.lat - tujuan.lat) > 1e-7 ||
          Math.abs(p.lng - tujuan.lng) > 1e-7
        )
          titikRef.current.setLatLng([tujuan.lat, tujuan.lng]);
      }
    } else if (titikRef.current) {
      titikRef.current.remove();
      titikRef.current = null;
    }

    if (posisi) {
      if (!kurirRef.current) {
        kurirRef.current = L.marker([posisi.lat, posisi.lng], {
          icon: L.divIcon({
            className: "peta-kurir-ikon",
            html: `<div class="peta-kurir">${PENGUIN}</div>`,
            iconSize: [54, 54],
            iconAnchor: [27, 48],
          }),
          interactive: false,
          zIndexOffset: 1000,
        }).addTo(map);
      } else {
        kurirRef.current.setLatLng([posisi.lat, posisi.lng]);
      }
      if (akurasi != null && akurasi > 1 && akurasi < 5000) {
        if (!lingkarRef.current) {
          lingkarRef.current = L.circle([posisi.lat, posisi.lng], {
            radius: akurasi,
            color: "#2166AC",
            weight: 1,
            opacity: 0.45,
            fillColor: "#2166AC",
            fillOpacity: 0.12,
            interactive: false,
          }).addTo(map);
        } else {
          lingkarRef.current.setLatLng([posisi.lat, posisi.lng]);
          lingkarRef.current.setRadius(akurasi);
        }
      } else if (lingkarRef.current) {
        lingkarRef.current.remove();
        lingkarRef.current = null;
      }
    } else {
      if (kurirRef.current) {
        kurirRef.current.remove();
        kurirRef.current = null;
      }
      if (lingkarRef.current) {
        lingkarRef.current.remove();
        lingkarRef.current = null;
      }
    }
  }, [siap, pilih, tujuan, posisi, akurasi]);

  // Pusatkan peta pada titik yang dipilih; saat kurir muncul, tampilkan keduanya.
  useEffect(() => {
    const L = lRef.current;
    const map = petaRef.current;
    if (!siap || !L || !map) return;

    if (tujuan && !posisi) {
      const dekat =
        map.getZoom() >= 15 &&
        map.distance(
          map.getCenter(),
          L.latLng(tujuan.lat, tujuan.lng),
        ) < 1200;
      if (!dekat)
        map.setView([tujuan.lat, tujuan.lng], Math.max(map.getZoom(), 16));
    }

    if (posisi && !kurirPas.current) {
      kurirPas.current = true;
      if (tujuan) {
        map.fitBounds(
          L.latLngBounds([
            [tujuan.lat, tujuan.lng],
            [posisi.lat, posisi.lng],
          ]),
          { padding: [44, 44], maxZoom: 17 },
        );
      } else {
        map.setView([posisi.lat, posisi.lng], 16);
      }
    }
  }, [siap, tujuan, posisi]);

  const catatan = pilih
    ? "Geser pin atau ketuk peta untuk menepatkan titik."
    : !tujuan
      ? "Titik pelanggan belum diatur."
      : posisi
        ? akurasi != null && akurasi > 1
          ? `Lokasi kurir langsung dari GPS · akurasi ±${Math.max(1, Math.round(akurasi))} m`
          : "Lokasi kurir diperbarui otomatis"
        : "Menunggu lokasi GPS kurir.";

  return (
    <div className="relative isolate overflow-hidden rounded-[16px] border border-line bg-[#E9F2F9]">
      <div
        ref={wadah}
        className={`${tinggi} w-full isolate`}
        role="region"
        aria-label={
          pilih
            ? "Peta untuk memilih titik pengantaran"
            : aktif
              ? `Peta lokasi kurir menuju ${labelTujuan.toLowerCase()}`
              : `Peta ${labelTujuan.toLowerCase()}`
        }
      />

      {!siap && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E9F2F9] text-[11.5px] font-semibold text-muted">
          Menyiapkan peta…
        </div>
      )}

      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-navy shadow-sm backdrop-blur">
        {pilih ? (
          <>
            <MapPin size={11} className="text-brand" />
            PILIH TITIK
          </>
        ) : aktif ? (
          posisi ? (
            <>
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-leaf" />
              LOKASI KURIR
            </>
          ) : (
            "MENUNGGU GPS KURIR"
          )
        ) : (
          <>
            <MapPin size={11} className="text-brand" />
            TITIK PENGANTARAN
          </>
        )}
      </div>

      {etaMenit != null && (
        <div className="pointer-events-none absolute right-2 top-2 z-10 rounded-lg bg-white/95 px-2 py-1 text-right shadow-sm backdrop-blur sm:right-3 sm:top-3 sm:px-2.5 sm:py-1.5">
          <p className="hidden text-[9px] font-bold uppercase tracking-wide text-muted sm:block">
            Estimasi tiba
          </p>
          <p className="stat-num text-[11px] font-extrabold leading-tight text-navy sm:text-[13px]">
            {etaMenit > 0 ? `${etaMenit} menit` : "Tiba"}
          </p>
        </div>
      )}

      <p className="pointer-events-none absolute bottom-2.5 left-3 z-10 max-w-[calc(100%-68px)] rounded-md bg-white/90 px-2 py-1 text-[8px] font-semibold text-muted backdrop-blur sm:text-[9px]">
        {catatan}
      </p>
    </div>
  );
}
