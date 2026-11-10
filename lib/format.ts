const TIMEZONE = "Asia/Jakarta";

export function rupiah(n: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));
}

export function tanggal(iso: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(iso));
}

export function tanggalJam(iso: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  }).format(new Date(iso));
}

export function jam(iso: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  }).format(new Date(iso));
}

export function relatif(iso: string): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const menit = Math.max(0, Math.round(diff / 60000));
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jamLalu = Math.round(menit / 60);
  if (jamLalu < 24) return `${jamLalu} jam lalu`;
  return `${Math.round(jamLalu / 24)} hari lalu`;
}

export function inisial(nama: string): string {
  return nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function normalTelepon(input: string): string {
  const digit = input.replace(/\D/g, "");
  if (digit.startsWith("0")) return "62" + digit.slice(1);
  if (digit.startsWith("62")) return digit;
  if (digit.startsWith("8")) return "62" + digit;
  return digit;
}

export function waLink(telepon: string, pesan: string): string {
  return `https://wa.me/${normalTelepon(telepon)}?text=${encodeURIComponent(pesan)}`;
}

export function teleponRapi(input: string): string {
  const tel = normalTelepon(input);
  return tel.startsWith("62") ? "0" + tel.slice(2) : tel;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function kodePesanan(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const acak = Math.floor(1000 + Math.random() * 9000);
  return `JY${get("year")}${get("month")}${get("day")}-${acak}`;
}

export function hariPendek(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    timeZone: TIMEZONE,
  }).format(new Date(iso));
}

export function kunciHari(date: Date | string = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).formatToParts(new Date(date));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function tanggalPanjang(date: Date | string = new Date()): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(date));
}
