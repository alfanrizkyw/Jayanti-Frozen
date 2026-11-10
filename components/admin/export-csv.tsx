"use client";

import { Download } from "lucide-react";

export function ExportCsv({
  nama,
  baris,
  label = "Unduh CSV",
}: {
  nama: string;
  baris: (string | number)[][];
  label?: string;
}) {
  function unduh() {
    const csv = baris
      .map((row) =>
        row
          .map((cell) => {
            const teks = String(cell ?? "");
            return /[",\n;]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks;
          })
          .join(";"),
      )
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={unduh} className="btn btn-outline btn-sm">
      <Download size={14} /> {label}
    </button>
  );
}
