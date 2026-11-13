export const KUNCI_PESANAN = "yanti-pesanan";
export const KUNCI_TELEPON = "yanti-hp";
const MAKS = 20;

export type KodeTersimpan = { kode: string; at: number };

export function bacaKodePesanan(): KodeTersimpan[] {
  try {
    const mentah = window.localStorage.getItem(KUNCI_PESANAN);
    if (!mentah) return [];
    const data: unknown = JSON.parse(mentah);
    if (!Array.isArray(data)) return [];
    return data
      .map((x) =>
        typeof x === "string"
          ? { kode: x, at: 0 }
          : {
              kode: String((x as KodeTersimpan)?.kode ?? ""),
              at: Number((x as KodeTersimpan)?.at) || 0,
            },
      )
      .filter((x) => x.kode)
      .slice(0, MAKS);
  } catch {
    return [];
  }
}

export function simpanKodePesanan(kode: string) {
  if (!kode) return;
  try {
    const lain = bacaKodePesanan().filter((x) => x.kode !== kode);
    const baru = [{ kode, at: Date.now() }, ...lain].slice(0, MAKS);
    window.localStorage.setItem(KUNCI_PESANAN, JSON.stringify(baru));
  } catch {
    /* penyimpanan bisa diblokir */
  }
}

export function hapusKodePesanan(kode: string) {
  try {
    const sisa = bacaKodePesanan().filter((x) => x.kode !== kode);
    window.localStorage.setItem(KUNCI_PESANAN, JSON.stringify(sisa));
  } catch {
    /* penyimpanan bisa diblokir */
  }
}

export function bacaTelepon(): string {
  try {
    return window.localStorage.getItem(KUNCI_TELEPON)?.replace(/\D/g, "") ?? "";
  } catch {
    return "";
  }
}

export function simpanTelepon(telepon: string) {
  const digit = telepon.replace(/\D/g, "");
  if (digit.length < 10 || digit.length > 15) return;
  try {
    window.localStorage.setItem(KUNCI_TELEPON, digit);
  } catch {
    /* penyimpanan bisa diblokir */
  }
}

export function hapusTelepon() {
  try {
    window.localStorage.removeItem(KUNCI_TELEPON);
  } catch {
    /* penyimpanan bisa diblokir */
  }
}
