"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function peranDari(path: string) {
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/kurir")) return "kurir";
  if (path.startsWith("/developer")) return "developer";
  return "pengunjung";
}

export function ErrorReporter() {
  const pathname = usePathname();

  useEffect(() => {
    let terakhir = 0;

    const kirim = (pesan: string) => {
      const teks = pesan.trim().slice(0, 700);
      if (teks.length < 5) return;
      if (/ResizeObserver|Script error\.?$/i.test(teks)) return;

      const sekarang = Date.now();
      if (sekarang - terakhir < 8_000) return;
      terakhir = sekarang;

      const kunci = `jf-bug:${teks.slice(0, 90)}`;
      try {
        if (sessionStorage.getItem(kunci)) return;
        sessionStorage.setItem(kunci, "1");
      } catch {
        // Penyimpanan browser bisa diblokir; laporan tetap dicoba.
      }

      fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pesan: teks,
          halaman: pathname,
          peran: peranDari(pathname),
        }),
        keepalive: true,
      }).catch(() => undefined);
    };

    const onError = (e: ErrorEvent) => {
      const lokasi = e.filename ? ` (${e.filename}:${e.lineno})` : "";
      kirim(`${e.message}${lokasi}`);
    };
    const onReject = (e: PromiseRejectionEvent) => {
      const alasan = e.reason;
      kirim(
        `Promise ditolak: ${
          alasan instanceof Error ? alasan.message : String(alasan)
        }`,
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
    };
  }, [pathname]);

  return null;
}
