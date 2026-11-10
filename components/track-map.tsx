"use client";

import { Navigation } from "lucide-react";

function titik(t: number) {
  const p0 = { x: 70, y: 190 };
  const p1 = { x: 132, y: 206 };
  const p2 = { x: 202, y: 86 };
  const p3 = { x: 320, y: 68 };
  const m = 1 - t;
  return {
    x: m ** 3 * p0.x + 3 * m ** 2 * t * p1.x + 3 * m * t ** 2 * p2.x + t ** 3 * p3.x,
    y: m ** 3 * p0.y + 3 * m ** 2 * t * p1.y + 3 * m * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

export function TrackMap({
  progress,
  aktif,
  etaMenit,
  gpsAktif,
  labelTujuan = "Alamat Anda",
}: {
  progress: number;
  aktif: boolean;
  etaMenit: number;
  gpsAktif: boolean;
  labelTujuan?: string;
}) {
  const t = Math.min(0.995, Math.max(0, progress));
  const pos = titik(t);
  const d = "M70 190 C132 206 202 86 320 68";

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line bg-[#E9F2F9]">
      <svg
        viewBox="0 0 400 240"
        className="block h-auto w-full"
        role="img"
        aria-label={
          aktif
            ? `Peta perjalanan kurir dari toko menuju ${labelTujuan.toLowerCase()}`
            : "Rute pengantaran pesanan"
        }
      >
        <rect width="400" height="240" fill="#E9F2F9" />

        <g fill="#D9E9F6">
          <rect x="16" y="18" width="74" height="46" rx="8" />
          <rect x="108" y="24" width="52" height="34" rx="7" />
          <rect x="238" y="14" width="66" height="38" rx="8" />
          <rect x="318" y="16" width="64" height="34" rx="7" />
          <rect x="24" y="80" width="48" height="30" rx="7" />
          <rect x="252" y="92" width="60" height="52" rx="8" />
          <rect x="336" y="96" width="48" height="44" rx="7" />
          <rect x="118" y="146" width="62" height="44" rx="8" />
          <rect x="216" y="166" width="58" height="36" rx="8" />
          <rect x="310" y="170" width="64" height="40" rx="8" />
        </g>

        <g>
          <rect x="168" y="22" width="58" height="36" rx="10" fill="#DBF0E6" />
          <circle cx="182" cy="36" r="5" fill="#B9DFCC" />
          <circle cx="198" cy="44" r="6" fill="#B9DFCC" />
          <circle cx="212" cy="33" r="4" fill="#B9DFCC" />
        </g>

        <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
          <path d="M0 138 H400" strokeWidth="16" />
          <path d="M216 0 V240" strokeWidth="13" />
          <path d="M0 72 H400" strokeWidth="6" opacity="0.85" />
          <path d="M104 0 V240" strokeWidth="5" opacity="0.85" />
          <path d="M320 0 V240" strokeWidth="5" opacity="0.85" />
        </g>
        <g stroke="#C7DCEE" strokeWidth="1" strokeDasharray="5 7" opacity="0.8">
          <path d="M0 138 H400" />
          <path d="M216 0 V240" />
        </g>

        <text x="110" y="132" fill="#7C97B3" fontSize="7" fontWeight="600">
          Jl. Melati
        </text>
        <text
          x="224"
          y="112"
          fill="#7C97B3"
          fontSize="7"
          fontWeight="600"
          transform="rotate(90 224 112)"
        >
          Jl. Soekarno Hatta
        </text>

        <path d={d} fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
        <path
          d={d}
          fill="none"
          stroke="#A9CDEC"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 7"
        />
        <path
          d={d}
          fill="none"
          stroke="#2166AC"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${t} 1`}
        />

        <g transform="translate(70 190)">
          <circle r="16" fill="#fff" opacity="0.95" />
          <rect x="-9" y="-8" width="18" height="16" rx="3" fill="#102B50" />
          <path d="M-9 -3 H9" stroke="#72B9EE" strokeWidth="1.6" />
          <rect x="-4" y="2" width="8" height="6" rx="1" fill="#E8F3FF" />
        </g>
        <text x="70" y="216" textAnchor="middle" fill="#102B50" fontSize="8" fontWeight="800">
          Toko
        </text>

        <g transform="translate(320 68)">
          <circle r="16" fill="#fff" opacity="0.95" />
          <circle r="11" fill="#2166AC" />
          <path
            d="M-4.5 1.5 0 -4 4.5 1.5v4a1 1 0 0 1-1 1H-3.5a1 1 0 0 1-1-1v-4Z"
            fill="#fff"
          />
        </g>
        <text x="320" y="94" textAnchor="middle" fill="#102B50" fontSize="8" fontWeight="800">
          {labelTujuan}
        </text>

        <g
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 1.2s linear",
          }}
        >
          <circle r="18" fill="#2166AC" opacity="0.12">
            {aktif && (
              <animate
                attributeName="r"
                values="14;24;14"
                dur="2.4s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle r="14" fill="#fff" />
          <circle r="10.5" fill="#2166AC" />
          <g stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round">
            <circle cx="-3.6" cy="3" r="2.4" />
            <circle cx="3.6" cy="3" r="2.4" />
            <path d="M-3.6 3h4l2-4h2" />
            <path d="M2.4 1.2 4 3" />
          </g>
        </g>
      </svg>

      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-navy shadow-sm backdrop-blur">
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

      <div className="absolute right-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-right shadow-sm backdrop-blur sm:right-3 sm:top-3 sm:px-2.5 sm:py-1.5">
        <p className="hidden text-[9px] font-bold uppercase tracking-wide text-muted sm:block">
          Estimasi tiba
        </p>
        <p className="stat-num text-[11px] font-extrabold leading-tight text-navy sm:text-[13px]">
          {etaMenit > 0 ? `${etaMenit} menit` : "Tiba"}
        </p>
      </div>

      <p className="absolute bottom-2.5 left-3 rounded-md bg-white/85 px-2 py-1 text-[8px] font-semibold text-muted backdrop-blur sm:text-[9px]">
        {gpsAktif ? "Posisi GPS kurir diterima" : "Perkiraan posisi berdasarkan waktu"}
      </p>
    </div>
  );
}
