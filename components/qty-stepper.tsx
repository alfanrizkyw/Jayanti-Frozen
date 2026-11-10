"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  small = false,
  label = "Jumlah",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  small?: boolean;
  label?: string;
}) {
  const size = small ? "h-9 w-9" : "h-11 w-11";

  return (
    <div
      className="inline-flex items-center rounded-xl border border-line bg-white"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Kurangi ${label.toLowerCase()}`}
        className={`${size} flex items-center justify-center rounded-l-xl text-navy transition-colors hover:bg-mist disabled:opacity-35`}
      >
        <Minus size={small ? 14 : 16} strokeWidth={2.4} />
      </button>
      <span
        className={`stat-num ${small ? "w-8 text-[13px]" : "w-10 text-sm"} text-center font-bold text-navy`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Tambah ${label.toLowerCase()}`}
        className={`${size} flex items-center justify-center rounded-r-xl text-navy transition-colors hover:bg-mist disabled:opacity-35`}
      >
        <Plus size={small ? 14 : 16} strokeWidth={2.4} />
      </button>
    </div>
  );
}
