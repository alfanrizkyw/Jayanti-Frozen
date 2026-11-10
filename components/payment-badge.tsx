import { Check, Clock3 } from "lucide-react";
import type { PaymentMethod } from "@/lib/types";
import { PAYMENT_LABEL } from "@/lib/types";

const pendek: Record<PaymentMethod, string> = {
  tunai: "Tunai",
  qris: "QRIS",
  transfer: "Transfer",
};

export function PaymentBadge({
  metode,
  dibayar,
  lengkap = false,
}: {
  metode: PaymentMethod;
  dibayar: boolean;
  lengkap?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold leading-none ${
        dibayar
          ? "border-[#C6E7DA] bg-leaf-soft text-leaf"
          : "border-[#F3DFBC] bg-[#FFF4E3] text-[#8A520B]"
      }`}
    >
      {dibayar ? <Check size={10} /> : <Clock3 size={10} />}
      {dibayar ? "Lunas" : "Belum bayar"} ·{" "}
      {lengkap ? PAYMENT_LABEL[metode] : pendek[metode]}
    </span>
  );
}
