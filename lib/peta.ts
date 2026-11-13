export interface Titik {
  lat: number;
  lng: number;
}

/** Seberapa rinci titik tujuan bisa dipastikan dari alamat tertulis. */
export type Presisi = "alamat" | "jalan" | "wilayah" | "kota";

export interface TitikAlamat {
  titik: Titik;
  presisi: Presisi;
}

const KOTA = "Kota Probolinggo, Jawa Timur";
const UA = "YantiFrozen/1.0 (toko frozen food Probolinggo)";
// Titik tengah kota dipakai untuk menyaring hasil pencarian yang melenceng jauh.
const PUSAT: Titik = { lat: -7.7441, lng: 113.2158 };
const BATAS = { lat: 0.35, lng: 0.45 };
const VIEWBOX = "113.00,-7.55,113.45,-7.95";

const cacheAlamat = new Map<string, TitikAlamat | null>();

function alamatLengkap(alamat: string) {
  const bersih = alamat.trim();
  if (!bersih) return "";
  return /probolinggo/i.test(bersih) ? bersih : `${bersih}, ${KOTA}`;
}

function dekatKota(titik: Titik) {
  return (
    Math.abs(titik.lat - PUSAT.lat) <= BATAS.lat &&
    Math.abs(titik.lng - PUSAT.lng) <= BATAS.lng
  );
}

/**
 * Alamat warga sering memakai RT/RW, nomor rumah, atau nama perumahan yang
 * tidak ada di peta. Dicoba bertingkat: alamat lengkap, nama jalan, lalu
 * kelurahan/kecamatan, supaya titik yang didapat tetap berasal dari peta asli.
 */
function varianAlamat(alamat: string): { query: string; presisi: Presisi }[] {
  const dasar = alamatLengkap(alamat);
  if (!dasar) return [];

  const tanpaRw = dasar
    .replace(/,?\s*RT\s*\d+\s*\/?\s*RW\s*\d+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const tanpaNomor = tanpaRw
    .replace(/\b(no\.?|nomor)\s*\d+[a-z]?\b/gi, "")
    .replace(/\s*,\s*(?=,)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const segmen = tanpaNomor
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/probolinggo|jawa timur/i.test(s));

  const hasil: { query: string; presisi: Presisi }[] = [];
  const tambah = (query: string, presisi: Presisi) => {
    const q = query.replace(/\s+/g, " ").trim();
    if (q && !hasil.some((h) => h.query === q)) hasil.push({ query: q, presisi });
  };

  tambah(dasar, "alamat");
  tambah(tanpaRw, "alamat");
  tambah(tanpaNomor, "alamat");
  tambah(`${segmen[0] ?? ""}, ${KOTA}`, "jalan");
  if (segmen.length > 1) tambah(`${segmen.slice(1).join(", ")}, ${KOTA}`, "wilayah");
  tambah(KOTA, "kota");
  return hasil;
}

async function cariAlamat(query: string): Promise<Titik | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "id");
  url.searchParams.set("accept-language", "id");
  url.searchParams.set("viewbox", VIEWBOX);
  url.searchParams.set("q", query);
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(7000),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { lat?: string; lon?: string }[];
  const hit = data?.[0];
  const titik = hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
  if (!titik || !Number.isFinite(titik.lat) || !Number.isFinite(titik.lng))
    return null;
  return dekatKota(titik) ? titik : null;
}

async function geocode(
  alamat: string,
  terimaKota = true,
): Promise<TitikAlamat | null> {
  const percobaan = varianAlamat(alamat);
  if (!percobaan.length) return null;
  const kunci = `${terimaKota ? "a" : "b"}|${percobaan[0].query}`;
  if (cacheAlamat.has(kunci)) return cacheAlamat.get(kunci) ?? null;

  try {
    for (const { query, presisi } of percobaan) {
      if (!terimaKota && presisi === "kota") continue;
      const titik = await cariAlamat(query);
      if (titik) {
        const temuan = { titik, presisi };
        if (cacheAlamat.size > 300) cacheAlamat.clear();
        cacheAlamat.set(kunci, temuan);
        return temuan;
      }
    }
    if (cacheAlamat.size < 200) cacheAlamat.set(kunci, null);
    return null;
  } catch {
    // Jaringan sedang bermasalah; jangan simpan kegagalan agar bisa dicoba lagi.
    return null;
  }
}

/**
 * Mencocokkan alamat tertulis dengan titik di peta. Dipakai sebagai bantuan
 * awal; pembeli tetap memeriksa dan menggeser pin ke titik yang benar.
 */
export async function cariTitikAlamat(
  alamat: string,
): Promise<TitikAlamat | null> {
  return geocode(alamat, false);
}
