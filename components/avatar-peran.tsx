import Image from "next/image";

const SUMBER = {
  kurir: "/karakter/kurir.png",
  admin: "/karakter/admin.png",
  developer: "/karakter/developer.png",
} as const;

const LABEL = {
  kurir: "Kurir Yanti Frozen",
  admin: "Admin Yanti Frozen",
  developer: "Developer Yanti Frozen",
} as const;

export function AvatarPeran({
  peran,
  ukuran = 36,
  className = "",
}: {
  peran: keyof typeof SUMBER;
  ukuran?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex flex-none overflow-hidden rounded-full bg-mist ${className}`}
      style={{ width: ukuran, height: ukuran }}
    >
      <Image
        src={SUMBER[peran]}
        alt={LABEL[peran]}
        width={ukuran * 2}
        height={ukuran * 2}
        loading="eager"
        className="h-full w-full scale-[1.12] object-cover"
      />
    </span>
  );
}
