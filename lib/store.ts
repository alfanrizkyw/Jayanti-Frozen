import { promises as fs } from "fs";
import path from "path";
import type { BankAccount, DB, Settings } from "./types";
import { createBootstrap, createDefaultSettings, createSeed } from "./seed";
import { tautanGambar } from "./format";
import {
  sheetsEnabled,
  readSnapshot,
  writeRows,
  deleteRow,
  writeSettings,
} from "./sheets";

type RowTable = Exclude<keyof DB, "settings">;

const CACHE_MS = 10_000;
const isProduction = process.env.NODE_ENV === "production";
const onVercel = Boolean(process.env.VERCEL);
// Demo hanya untuk pengembangan lokal. Produksi selalu kosong kecuali data asli.
const demoMode = isProduction
  ? false
  : process.env.SEED_DEMO !== "false" && !onVercel;
const localFile = path.join(process.cwd(), ".data", "db.json");

let cache: { db: DB; at: number } | null = null;
let membaca: Promise<DB> | null = null;
let membacaSegar: Promise<DB> | null = null;
let menyegarkan: Promise<DB> | null = null;
let seeding: Promise<void> | null = null;
let versi = 0;
let queue: Promise<unknown> = Promise.resolve();

function parseJadwal(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string" || !value.trim()) return fallback;
  const teks = value.trim();
  if (teks.startsWith("[")) {
    try {
      const parsed = JSON.parse(teks);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Biarkan jatuh ke pemisahan baris di bawah.
    }
  }
  return teks
    .split(/\r?\n|;|\|/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function rapikanBank(value: unknown, fallback: BankAccount[]): BankAccount[] {
  let daftar: unknown = value;
  if (typeof value === "string") {
    try {
      daftar = JSON.parse(value);
    } catch {
      daftar = [];
    }
  }
  if (!Array.isArray(daftar)) return fallback;
  const bersih = daftar
    .filter((b): b is Record<string, unknown> => Boolean(b) && typeof b === "object")
    .map((b) => ({
      bank: String(b.bank ?? "").trim(),
      nomor: String(b.nomor ?? "").trim(),
      atasNama: String(b.atasNama ?? "").trim(),
    }))
    .filter((b) => b.nomor)
    .slice(0, 8);
  if (bersih.length) return bersih;
  return fallback.filter((b) => b.nomor);
}

function normalSettings(raw?: Partial<Settings> | null): Settings {
  const dasar = createDefaultSettings();
  const gabung = { ...dasar, ...(raw ?? {}) } as Settings &
    Record<string, unknown>;
  const telepon =
    !gabung.telepon || String(gabung.telepon) === "6281234567890"
      ? dasar.telepon
      : String(gabung.telepon);
  const jadwal = parseJadwal(gabung.jadwalKirim, dasar.jadwalKirim)
    .map((s) => s.trim())
    .filter(Boolean);
  const rekening = String(gabung.rekening ?? dasar.rekening);
  const atasNama = String(gabung.atasNama ?? dasar.atasNama);
  const alamat = String(gabung.alamat ?? "").trim();
  return {
    ...gabung,
    namaToko: String(gabung.namaToko || dasar.namaToko),
    telepon,
    alamat:
      !alamat || alamat === "Jl. Melati No. 12, Klojen, Malang"
        ? dasar.alamat
        : alamat,
    mapsUrl: String(gabung.mapsUrl || dasar.mapsUrl),
    jamBuka: String(gabung.jamBuka ?? dasar.jamBuka),
    rekening,
    atasNama,
    qrisNama: String(gabung.qrisNama ?? dasar.qrisNama),
    qrisGambar: tautanGambar(String(gabung.qrisGambar ?? dasar.qrisGambar)),
    bank: rapikanBank(gabung.bank, [
      {
        bank: rekening.split(" ")[0] || "BCA",
        nomor: rekening.split(" ").slice(1).join(" ") || rekening,
        atasNama,
      },
    ]),
    whatsappAdmin: String(gabung.whatsappAdmin || dasar.whatsappAdmin),
    tokoBuka:
      gabung.tokoBuka === false || String(gabung.tokoBuka) === "false"
        ? false
        : true,
    tutupCatatan: String(gabung.tutupCatatan ?? dasar.tutupCatatan),
    jadwalKirim: Array.from(new Set(jadwal)).slice(0, 20),
  };
}

function normalize(db: Partial<DB>): DB {
  const couriers = (db.couriers ?? []).map((raw) => {
    // Baris lama menyimpan PIN teks biasa. Buang dari memori agar tidak pernah
    // ikut terkirim ke browser; verifikasi memakai sandi hash.
    const { pin: _pin, ...sisa } = raw as typeof raw & { pin?: string };
    return {
      ...sisa,
      sandi: typeof sisa.sandi === "string" ? sisa.sandi : "",
      aktif: sisa.aktif !== false,
    };
  });
  return {
    users: db.users ?? [],
    products: (db.products ?? []).map((p) => ({
      ...p,
      gambar: tautanGambar(String(p.gambar ?? "")) || "/produk/nugget.jpg",
    })),
    orders: db.orders ?? [],
    orderItems: db.orderItems ?? [],
    couriers,
    deliveries: db.deliveries ?? [],
    promotions: (db.promotions ?? []).map((p) => ({
      ...p,
      gambar: tautanGambar(String(p.gambar ?? "")),
    })),
    staff: db.staff ?? [],
    bugs: db.bugs ?? [],
    settings: normalSettings(db.settings),
  };
}

function pastikanPenyimpanan() {
  if (!sheetsEnabled && isProduction && onVercel) {
    throw new Error(
      "Database Google Sheets belum terhubung. Isi GOOGLE_SHEETS_URL dan GOOGLE_SHEETS_KEY di Environment Variables Vercel, lalu redeploy.",
    );
  }
}

async function readLocal(): Promise<DB> {
  try {
    const raw = await fs.readFile(localFile, "utf8");
    return normalize(JSON.parse(raw));
  } catch {
    const awal = demoMode ? createSeed() : createBootstrap();
    await writeLocal(awal);
    return awal;
  }
}

async function writeLocal(db: DB) {
  await fs.mkdir(path.dirname(localFile), { recursive: true });
  await fs.writeFile(localFile, JSON.stringify(db, null, 2), "utf8");
}

async function seedDatabase() {
  if (seeding) return seeding;
  seeding = (async () => {
    const data = demoMode ? createSeed() : createBootstrap();
    if (sheetsEnabled) {
      if (demoMode) {
        await writeRows("users", data.users);
        await writeRows("products", data.products);
        await writeRows("promotions", data.promotions);
        await writeRows("orders", data.orders);
        await writeRows("orderItems", data.orderItems);
        await writeRows("deliveries", data.deliveries);
        await writeRows("bugs", data.bugs);
      }
      await writeRows("couriers", data.couriers);
      await writeRows("staff", data.staff);
      await writeSettings(data.settings);
    } else {
      await writeLocal(data);
    }
    cache = { db: data, at: Date.now() };
  })().finally(() => {
    seeding = null;
  });
  return seeding;
}

async function bootstrapAkun(db: DB): Promise<DB> {
  let berubah = false;
  if (!db.staff.length) {
    db.staff = createBootstrap().staff;
    try {
      await saveRows("staff", db.staff);
      berubah = true;
    } catch (err) {
      console.error("[jayanti] gagal menyiapkan akun admin awal:", err);
    }
  }
  if (!db.couriers.length) {
    db.couriers = createBootstrap().couriers;
    try {
      await saveRows("couriers", db.couriers);
      berubah = true;
    } catch (err) {
      console.error("[jayanti] gagal menyiapkan akun kurir awal:", err);
    }
  }
  return berubah ? normalize(db) : db;
}

export async function readDB(segar = false): Promise<DB> {
  // Data yang wajib terbaru (mis. pesanan baru dari instance Vercel lain)
  // membaca ulang langsung, tanpa memakai salinan cache lama.
  if (segar) {
    if (!membacaSegar) {
      membacaSegar = bacaDB()
        .catch((err) => {
          console.error("[jayanti] gagal membaca ulang data:", err);
          if (cache) return cache.db;
          throw err;
        })
        .finally(() => {
          membacaSegar = null;
        });
    }
    return membacaSegar;
  }
  // Setelah data pernah dibaca, halaman selalu memakai salinan cache dan
  // menyegarkan di latar belakang. Pembeli tidak perlu menunggu Google Sheets.
  if (cache) {
    if (Date.now() - cache.at >= CACHE_MS && !menyegarkan) {
      menyegarkan = bacaDB()
        .catch((err) => {
          console.error("[jayanti] gagal menyegarkan cache:", err);
          return cache!.db;
        })
        .finally(() => {
          menyegarkan = null;
        });
    }
    return cache.db;
  }
  if (membaca) return membaca;
  membaca = bacaDB().finally(() => {
    membaca = null;
  });
  return membaca;
}

async function bacaDB(): Promise<DB> {
  pastikanPenyimpanan();
  const versiAwal = versi;

  let db: DB;

  if (sheetsEnabled) {
    try {
      const mentah = await readSnapshot();
      db = normalize(mentah);
      const belumDiisi =
        !(mentah.staff ?? []).length && !(mentah.couriers ?? []).length;
      if (belumDiisi) {
        await seedDatabase();
        db = normalize(await readSnapshot());
      }
    } catch (err) {
      console.error("[jayanti] gagal membaca Google Sheets:", err);
      if (cache) {
        cache.at = Date.now();
        return cache.db;
      }
      throw err instanceof Error
        ? err
        : new Error("Gagal membaca database Google Sheets.");
    }
  } else {
    db = await readLocal();
  }

  db = await bootstrapAkun(db);
  if (versiAwal === versi || !cache) cache = { db, at: Date.now() };
  return cache?.db ?? db;
}

function tulisKeCache(table: RowTable, rows: { id: string }[]) {
  if (!cache) return;
  const peta = new Map(
    (cache.db[table] as { id: string }[]).map((row) => [row.id, row]),
  );
  for (const row of rows) peta.set(row.id, row);
  (cache.db[table] as unknown) = Array.from(peta.values());
  cache.at = Date.now();
  versi += 1;
}

function hapusDariCache(table: RowTable, id: string) {
  if (!cache) return;
  (cache.db[table] as unknown) = (
    cache.db[table] as { id: string }[]
  ).filter((row) => row.id !== id);
  cache.at = Date.now();
  versi += 1;
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export async function saveRows<T>(table: RowTable, rows: T[]): Promise<void> {
  if (!rows.length) return;
  await enqueue(async () => {
    if (sheetsEnabled) {
      await writeRows(table, rows);
    } else {
      const db = await readLocal();
      const byId = new Map((db[table] as { id: string }[]).map((r) => [r.id, r]));
      for (const row of rows as { id: string }[]) byId.set(row.id, row);
      (db[table] as unknown[]) = Array.from(byId.values());
      await writeLocal(db);
    }
    tulisKeCache(table, rows as unknown as { id: string }[]);
  });
}

export async function removeRow(table: RowTable, id: string): Promise<void> {
  await enqueue(async () => {
    if (sheetsEnabled) {
      await deleteRow(table, id);
    } else {
      const db = await readLocal();
      (db[table] as unknown[]) = (db[table] as { id: string }[]).filter(
        (r) => r.id !== id,
      );
      await writeLocal(db);
    }
    hapusDariCache(table, id);
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  await enqueue(async () => {
    if (sheetsEnabled) {
      await writeSettings(settings);
    } else {
      const db = await readLocal();
      db.settings = settings;
      await writeLocal(db);
    }
    if (cache) {
      cache.db.settings = settings;
      cache.at = Date.now();
      versi += 1;
    }
  });
}

export async function storageMode(): Promise<"sheets" | "lokal" | "belum"> {
  if (sheetsEnabled) return "sheets";
  if (isProduction && onVercel) return "belum";
  return "lokal";
}
