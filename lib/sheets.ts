import type { DB, Settings } from "./types";

const URL = process.env.GOOGLE_SHEETS_URL;
const KEY = process.env.GOOGLE_SHEETS_KEY;

export const sheetsEnabled = Boolean(URL && KEY);

/** True bila Apps Script sudah versi 2 (cache snapshot + aksi batch). */
export let backendCepat = false;

type TableName = Exclude<keyof DB, "settings">;

// Apps Script memakai nama tab berhuruf besar.
const TABEL_SHEET: Record<TableName, string> = {
  users: "Users",
  products: "Products",
  orders: "Orders",
  orderItems: "OrderItems",
  couriers: "Couriers",
  deliveries: "Deliveries",
  promotions: "Promotions",
  staff: "Staff",
  bugs: "Bugs",
};

function redact(text: string) {
  return KEY ? text.split(KEY).join("[disembunyikan]") : text;
}

async function call(params: Record<string, string>) {
  if (!URL || !KEY) throw new Error("Google Sheets belum dikonfigurasi");
  const qs = new URLSearchParams({ key: KEY, ...params });
  let res: Response;
  try {
    res = await fetch(`${URL}?${qs.toString()}`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : String(err);
    throw new Error(`Google Sheets tidak dapat dihubungi: ${redact(pesan)}`);
  }
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 160);
    throw new Error(
      `Google Sheets ${res.status}${detail ? `: ${redact(detail)}` : ""}`,
    );
  }
  const json = await res.json();
  if (!json?.ok) throw new Error(json?.error || "Respons Google Sheets tidak valid");
  return json;
}

export async function readSnapshot(): Promise<DB> {
  // Apps Script sesekali lambat atau menolak permintaan saat mulai dingin.
  // Satu percobaan ulang menjaga halaman toko tidak ikut gagal.
  let terakhir: unknown;
  for (let percobaan = 0; percobaan < 2; percobaan++) {
    try {
      const json = await call({ action: "read" });
      backendCepat = Number(json.versi) >= 2;
      return json.data as DB;
    } catch (err) {
      terakhir = err;
      if (percobaan === 0)
        await new Promise((selesai) => setTimeout(selesai, 400));
    }
  }
  throw terakhir instanceof Error
    ? terakhir
    : new Error("Gagal membaca database Google Sheets.");
}

export async function writeRows(table: TableName, rows: unknown[]): Promise<void> {
  let batch: unknown[] = [];
  let size = 0;
  const flush = async () => {
    if (!batch.length) return;
    await call({
      action: "upsert",
      table: TABEL_SHEET[table],
      rows: JSON.stringify(batch),
    });
    batch = [];
    size = 0;
  };
  for (const row of rows) {
    const len = JSON.stringify(row).length * 3;
    if (size + len > 5000 && batch.length) await flush();
    batch.push(row);
    size += len;
  }
  await flush();
}

export async function deleteRow(table: TableName, id: string): Promise<void> {
  await call({ action: "delete", table: TABEL_SHEET[table], id });
}

export interface BatchEntry {
  table: TableName;
  rows: unknown[];
  /** Bila diisi, hanya kolom ini yang ditimpa pada baris yang sudah ada. */
  fields?: string[];
}

/**
 * Kirim perubahan beberapa tabel dalam satu permintaan. Alur status pesanan
 * memakai ini supaya satu klik admin tidak menunggu tiga perjalanan Sheets.
 */
export async function writeBatch(entries: BatchEntry[]): Promise<void> {
  const dipakai = entries.filter((entry) => entry.rows.length);
  if (!dipakai.length) return;

  const tables: Record<string, { rows: unknown[]; fields?: string[] }> = {};
  for (const entry of dipakai) {
    tables[TABEL_SHEET[entry.table]] = entry.fields?.length
      ? { rows: entry.rows, fields: entry.fields }
      : { rows: entry.rows };
  }

  try {
    await call({ action: "batch", data: JSON.stringify({ tables }) });
  } catch (err) {
    const pesan = err instanceof Error ? err.message : "";
    // Apps Script lama belum mengenal aksi batch; tulis per tabel seperti biasa.
    if (!/tidak dikenal|unknown/i.test(pesan)) throw err;
    for (const entry of dipakai) await writeRows(entry.table, entry.rows);
  }
}

export async function writeSettings(settings: Settings): Promise<void> {
  // Apps Script menyimpan sel sebagai teks, jadi daftar rekening dikirim
  // sebagai JSON agar tidak menjadi "[object Object]".
  const kirim = { ...settings, bank: JSON.stringify(settings.bank ?? []) };
  await call({ action: "settings", value: JSON.stringify(kirim) });
}
