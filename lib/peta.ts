import type { Order, Settings } from "./types";

export interface Titik {
  lat: number;
  lng: number;
}

/** Seberapa rinci titik tujuan bisa dipastikan dari alamat tertulis. */
export type Presisi = "alamat" | "jalan" | "wilayah" | "kota" | "tidak-ada";

export interface HasilRute {
  toko: Titik;
  tujuan: Titik | null;
  /** [lat, lng] mengikuti jalan dari OSRM; kosong bila tujuan belum diketahui. */
  rute: [number, number][];
  jarakMeter: number;
  durasiDetik: number;
  presisi: Presisi;
}

interface Temuan {
  titik: Titik;
  presisi: Exclude<Presisi, "tidak-ada">;
}

const KOTA = "Kota Probolinggo, Jawa Timur";
const UA = "YantiFrozen/1.0 (toko frozen food Probolinggo)";
// Titik tengah kota dipakai untuk menyaring hasil pencarian yang melenceng jauh.
const PUSAT: Titik = { lat: -7.7441, lng: 113.2158 };
const BATAS = { lat: 0.35, lng: 0.45 };
const VIEWBOX = "113.00,-7.55,113.45,-7.95";

const cacheAlamat = new Map<string, Temuan | null>();
const cacheRute = new Map<string, HasilRute | null>();

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

/** Titik toko bisa dipatok tepat lewat PETA_TITIK_TOKO="lat,lng". */
function titikTokoEnv(): Titik | null {
  const isi = process.env.PETA_TITIK_TOKO?.trim();
  if (!isi) return null;
  const [lat, lng] = isi.split(",").map((n) => Number(n));
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

/**
 * Alamat warga sering memakai RT/RW, nomor rumah, atau nama perumahan yang
 * tidak ada di peta. Dicoba bertingkat: alamat lengkap, nama jalan, lalu
 * kelurahan/kecamatan, supaya titik yang didapat tetap berasal dari peta asli.
 */
function varianAlamat(
  alamat: string,
): { query: string; presisi: Temuan["presisi"] }[] {
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

  const hasil: { query: string; presisi: Temuan["presisi"] }[] = [];
  const tambah = (query: string, presisi: Temuan["presisi"]) => {
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
): Promise<Temuan | null> {
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

async function ruteJalan(
  dari: Titik,
  ke: Titik,
): Promise<{ rute: [number, number][]; jarak: number; durasi: number } | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${dari.lng},${dari.lat};${ke.lng},${ke.lat}` +
      `?overview=full&geometries=geojson`;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      routes?: {
        distance?: number;
        duration?: number;
        geometry?: { coordinates?: [number, number][] };
      }[];
    };
    const jalur = json.routes?.[0];
    const koordinat = jalur?.geometry?.coordinates;
    if (!jalur || !koordinat?.length) return null;
    return {
      rute: koordinat.map(([lng, lat]) => [lat, lng] as [number, number]),
      jarak: Number(jalur.distance ?? 0),
      durasi: Number(jalur.duration ?? 0),
    };
  } catch {
    return null;
  }
}

/**
 * Rute pengantaran asli: titik toko dan alamat pembeli dicari di peta OSM, lalu
 * disambungkan mengikuti jalan oleh OSRM. Bila alamat pembeli tidak ditemukan,
 * peta tetap memakai titik toko asli dan `tujuan` dikosongkan agar tidak
 * menampilkan titik palsu.
 */
export async function rutePengantaran(
  order: Order,
  settings: Settings,
): Promise<HasilRute | null> {
  const kunci = `${order.kode}|${order.alamat}|${settings.alamat}`;
  if (cacheRute.has(kunci)) return cacheRute.get(kunci) ?? null;

  try {
    const [temuanToko, temuanTujuan] = await Promise.all([
      geocode(settings.alamat),
      geocode(order.alamat, false),
    ]);
    const toko = titikTokoEnv() ?? temuanToko?.titik ?? PUSAT;
    const tujuan = temuanTujuan?.titik ?? null;
    const presisi: Presisi = temuanTujuan?.presisi ?? "tidak-ada";

    const jalan = tujuan ? await ruteJalan(toko, tujuan) : null;
    const hasil: HasilRute = {
      toko,
      tujuan,
      rute: jalan?.rute?.length ? jalan.rute : [],
      jarakMeter: jalan?.jarak ?? 0,
      durasiDetik: jalan?.durasi ?? 0,
      presisi,
    };

    if (cacheRute.size > 300) cacheRute.clear();
    cacheRute.set(kunci, hasil);
    return hasil;
  } catch {
    return null;
  }
}
