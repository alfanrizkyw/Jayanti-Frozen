"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Move, Upload, X, ZoomIn } from "lucide-react";

const UKURAN = {
  produk: { fw: 320, fh: 240, ow: 900, oh: 675, teks: "Rasio tetap 4:3 · 900 × 675 piksel" },
  banner: { fw: 320, fh: 180, ow: 1600, oh: 900, teks: "Rasio tetap 16:9 · 1600 × 900 piksel" },
} as const;

type Rasio = keyof typeof UKURAN;

export function ImageCropper({
  file,
  rasio = "produk",
  onCancel,
  onDone,
}: {
  file: File;
  rasio?: Rasio;
  onCancel: () => void;
  onDone: (url: string) => void;
}) {
  const { fw: FW, fh: FH, ow: OUT_W, oh: OUT_H } = UKURAN[rasio];
  const [src, setSrc] = useState("");
  const [dimensi, setDimensi] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [unggah, setUnggah] = useState(false);
  const [error, setError] = useState("");
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const frame = useRef<HTMLDivElement>(null);

  const s0 = dimensi ? Math.max(FW / dimensi.w, FH / dimensi.h) : 1;
  const skala = s0 * zoom;
  const rw = dimensi ? dimensi.w * skala : FW;
  const rh = dimensi ? dimensi.h * skala : FH;

  function batasi(x: number, y: number, z = zoom) {
    if (!dimensi) return { x, y };
    const s = s0 * z;
    const mx = Math.max(0, (dimensi.w * s - FW) / 2);
    const my = Math.max(0, (dimensi.h * s - FH) / 2);
    return {
      x: Math.max(-mx, Math.min(mx, x)),
      y: Math.max(-my, Math.min(my, y)),
    };
  }

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape" && !unggah) onCancel();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [unggah, onCancel]);

  function mulai(e: React.PointerEvent) {
    if (!dimensi) return;
    drag.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
    frame.current?.setPointerCapture(e.pointerId);
  }

  function gerak(e: React.PointerEvent) {
    if (!drag.current) return;
    const d = drag.current;
    setPos(batasi(d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y)));
  }

  function lepas(e: React.PointerEvent) {
    drag.current = null;
    if (frame.current?.hasPointerCapture(e.pointerId)) {
      frame.current.releasePointerCapture(e.pointerId);
    }
  }

  function ubahZoom(nilai: number) {
    setZoom(nilai);
    setPos((p) => batasi(p.x, p.y, nilai));
  }

  async function potong() {
    if (!dimensi) return;
    setUnggah(true);
    setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUT_W;
      canvas.height = OUT_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Peramban tidak mendukung pemrosesan gambar.");

      const sw = FW / skala;
      const sh = FH / skala;
      const sx = (rw - FW) / 2 / skala - pos.x / skala;
      const sy = (rh - FH) / 2 / skala - pos.y / skala;

      const img = new Image();
      img.src = src;
      await img.decode();
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, OUT_W, OUT_H);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.88),
      );
      if (!blob) throw new Error("Gagal menyiapkan gambar.");

      const form = new FormData();
      form.append("file", new File([blob], "foto-produk.jpg", { type: "image/jpeg" }));
      const res = await fetch(`/api/upload?rasio=${rasio}`, {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok || !json?.url)
        throw new Error(json?.error || "Upload gagal. Coba lagi.");
      onDone(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal. Coba lagi.");
      setUnggah(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atur potongan foto"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/55 p-3 backdrop-blur-sm fade-in"
    >
      <div className="w-full max-w-[460px] overflow-hidden rounded-[20px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <h2 className="text-[14px] font-extrabold text-navy">Atur foto</h2>
            <p className="text-[10.5px] text-muted">{UKURAN[rasio].teks}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={unggah}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-paper"
            aria-label="Tutup pengaturan foto"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div
            ref={frame}
            onPointerDown={mulai}
            onPointerMove={gerak}
            onPointerUp={lepas}
            onPointerCancel={lepas}
            className="relative mx-auto overflow-hidden rounded-xl border border-line bg-paper touch-none select-none"
            style={{ width: FW, height: FH, cursor: dimensi ? "grab" : "default" }}
          >
            {src && dimensi && (
              <img
                src={src}
                alt="Pratinjau foto"
                draggable={false}
                className="absolute max-w-none"
                style={{
                  width: rw,
                  height: rh,
                  left: (FW - rw) / 2 + pos.x,
                  top: (FH - rh) / 2 + pos.y,
                }}
              />
            )}
            {!dimensi && (
              <span className="absolute inset-0 flex items-center justify-center text-[11.5px] text-muted">
                Memuat foto…
              </span>
            )}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute inset-y-0 left-1/3 w-px bg-white/55" />
              <div className="absolute inset-y-0 left-2/3 w-px bg-white/55" />
              <div className="absolute inset-x-0 top-1/3 h-px bg-white/55" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-white/55" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/60" />
            </div>
          </div>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-muted">
            <Move size={12} /> Geser foto, atur zoom agar produk pas di tengah.
          </p>

          <div className="mt-3 flex items-center gap-3">
            <ZoomIn size={16} className="flex-none text-muted" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => ubahZoom(Number(e.target.value))}
              className="h-1.5 w-full accent-[#2166AC]"
              aria-label="Perbesar atau perkecil foto"
            />
            <span className="w-10 flex-none text-right text-[11px] font-bold text-navy">
              {zoom.toFixed(1)}×
            </span>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPos({ x: 0, y: 0 });
              }}
              className="btn btn-sm btn-ghost"
            >
              Tengahkan
            </button>
            <label className="btn btn-sm btn-outline ml-auto cursor-pointer">
              Ganti foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setDimensi(null);
                  setZoom(1);
                  setPos({ x: 0, y: 0 });
                  setSrc(URL.createObjectURL(f));
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>

          {error && (
            <p className="mt-2 rounded-lg border border-[#F5CFCB] bg-[#FDF2F1] px-3 py-2 text-[11px] text-[#8F2E25]">
              {error}
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2 border-t border-line bg-paper/60 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={unggah}
            className="btn btn-outline flex-1"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={potong}
            disabled={unggah || !dimensi}
            className="btn btn-primary flex-1"
          >
            {unggah ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {unggah ? "Mengunggah…" : "Gunakan foto"}
          </button>
        </div>
      </div>

      {src && (
        <img
          src={src}
          alt=""
          className="hidden"
          onLoad={(e) =>
            setDimensi({
              w: e.currentTarget.naturalWidth,
              h: e.currentTarget.naturalHeight,
            })
          }
        />
      )}
    </div>
  );
}
