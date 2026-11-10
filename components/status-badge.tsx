import type { OrderStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/types";

const tones: Record<string, string> = {
  amber: "bg-[#FFF4E3] text-[#8A520B] border-[#F3DFBC]",
  blue: "bg-mist text-brand border-[#C9E1F7]",
  teal: "bg-[#E6F6F4] text-[#12655C] border-[#C3E8E2]",
  green: "bg-leaf-soft text-leaf border-[#C6E7DA]",
  slate: "bg-[#EEF2F7] text-muted border-line",
};

export function StatusBadge({
  status,
  tone = "blue",
}: {
  status: string;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none ${tones[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const toneMap: Record<OrderStatus, keyof typeof tones> = {
    baru: "amber",
    dikonfirmasi: "blue",
    disiapkan: "blue",
    siap: "teal",
    diantar: "blue",
    selesai: "green",
    batal: "slate",
  };
  return <StatusBadge status={STATUS_LABEL[status]} tone={toneMap[status]} />;
}
