const TIMEZONE = "Asia/Jakarta";

export async function salinTeks(teks: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(teks);
      return true;
    }
  } catch {
    // Browser atau WebView bisa menolak Clipboard API; lanjut ke cara lama.
  }
  try {
    const area = document.createElement("textarea");
    area.value = teks;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, teks.length);
    const berhasil = document.execCommand("copy");
    document.body.removeChild(area);
    return berhasil;
  } catch {
    return false;
  }
}

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

const HOST_GAMBAR = [
  "images.pexels.com",
  "public.blob.vercel-storage.com",
  "googleusercontent.com",
  "drive.google.com",
];

/** Hanya host yang terdaftar di next.config yang boleh lewat optimizer gambar. */
export function gambarTeroptimasi(src: string): boolean {
  const url = (src ?? "").trim();
  if (!url) return false;
  if (url.startsWith("/")) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return HOST_GAMBAR.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** Ubah tautan Google Drive biasa menjadi tautan gambar yang bisa ditampilkan. */
export function tautanGambar(input: string): string {
  const url = input.trim();
  if (!url.startsWith("http")) return url;
  const cocok =
    url.match(/drive\.google\.com\/file\/d\/([\w-]{10,})/) ||
    url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*\bid=([\w-]{10,})/) ||
    url.match(/docs\.google\.com\/[^/]+\/d\/([\w-]{10,})/);
  if (cocok) return `https://lh3.googleusercontent.com/d/${cocok[1]}=w1000`;
  return url;
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
