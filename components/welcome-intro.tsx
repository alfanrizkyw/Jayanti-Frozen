"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const KUNCI = "jayanti-sambutan";

export function WelcomeIntro() {
  const [buka, setBuka] = useState(false);

  useEffect(() => {
    let sudah = false;
    try {
      sudah = window.sessionStorage.getItem(KUNCI) === "1";
    } catch {
      sudah = false;
    }
    if (sudah) return;
    const jeda = window.setTimeout(() => setBuka(true), 420);
    return () => window.clearTimeout(jeda);
  }, []);

  useEffect(() => {
    if (!buka) return;
    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("sambutan-dialog")?.focus();

    function tekan(e: KeyboardEvent) {
      if (e.key === "Escape") tutup();
    }
    document.addEventListener("keydown", tekan);
    return () => {
      document.body.style.overflow = sebelumnya;
      document.removeEventListener("keydown", tekan);
    };
  }, [buka]);

  function tutup() {
    try {
      window.sessionStorage.setItem(KUNCI, "1");
    } catch {
      /* sessionStorage bisa diblokir */
    }
    setBuka(false);
  }

  if (!buka) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sambutan-judul"
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Tutup sambutan"
        onClick={tutup}
        className="absolute inset-0 bg-navy-deep/50 backdrop-blur-[3px] fade-in"
      />
      <div
        id="sambutan-dialog"
        tabIndex={-1}
        className="intro-pop relative w-full max-w-[380px] rounded-[24px] border border-line bg-white p-6 text-center shadow-lift outline-none"
      >
        <button
          type="button"
          onClick={tutup}
          aria-label="Tutup sambutan"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-mist hover:text-navy"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center">
          <Logo size={56} />
        </div>

        <p className="mt-5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand">
          Jayanti Frozen
        </p>
        <h2
          id="sambutan-judul"
          className="mt-2 text-[22px] font-extrabold leading-tight text-navy"
        >
          Selamat datang di Jayanti Frozen
        </h2>
        <p className="mx-auto mt-2.5 max-w-[290px] text-[13px] leading-relaxed text-muted">
          Frozen food segar dari Malang. Ambil di toko atau kami antar ke rumah.
        </p>

        <Link
          id="sambutan-mulai"
          href="/katalog"
          onClick={tutup}
          className="btn btn-primary mt-6 w-full"
        >
          Mulai belanja <ArrowRight size={16} />
        </Link>
        <button
          type="button"
          onClick={tutup}
          className="mt-1 min-h-11 w-full text-[12.5px] font-semibold text-muted transition-colors hover:text-navy"
        >
          Lihat-lihat dulu
        </button>
      </div>
    </div>
  );
}
