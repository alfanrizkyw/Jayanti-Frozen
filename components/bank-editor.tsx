"use client";

import { Plus, Trash2 } from "lucide-react";
import type { BankAccount } from "@/lib/types";

export function BankEditor({
  value,
  onChange,
}: {
  value: BankAccount[];
  onChange: (bank: BankAccount[]) => void;
}) {
  function ubah(index: number, key: keyof BankAccount, isi: string) {
    onChange(
      value.map((row, i) => (i === index ? { ...row, [key]: isi } : row)),
    );
  }

  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div
          key={i}
          className="grid gap-2 rounded-xl border border-line p-2.5 sm:grid-cols-[0.8fr_1.2fr_1fr_auto]"
        >
          <input
            className="field min-h-11"
            value={row.bank}
            onChange={(e) => ubah(i, "bank", e.target.value)}
            placeholder="Bank"
            aria-label={`Nama bank rekening ${i + 1}`}
          />
          <input
            className="field min-h-11"
            value={row.nomor}
            onChange={(e) => ubah(i, "nomor", e.target.value)}
            placeholder="Nomor rekening"
            aria-label={`Nomor rekening ${i + 1}`}
            inputMode="numeric"
          />
          <input
            className="field min-h-11"
            value={row.atasNama}
            onChange={(e) => ubah(i, "atasNama", e.target.value)}
            placeholder="Atas nama"
            aria-label={`Atas nama rekening ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, x) => x !== i))}
            className="btn btn-danger min-h-11 px-3"
            aria-label={`Hapus rekening ${row.bank || i + 1}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {value.length < 8 && (
        <button
          type="button"
          onClick={() =>
            onChange([...value, { bank: "", nomor: "", atasNama: "" }])
          }
          className="btn btn-outline btn-sm"
        >
          <Plus size={13} /> Tambah rekening
        </button>
      )}
      {value.length === 0 && (
        <p className="text-[11.5px] text-muted">
          Belum ada rekening. Pembeli hanya bisa memakai tunai atau QRIS.
        </p>
      )}
    </div>
  );
}
