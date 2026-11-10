import type { DB, Settings } from "./types";

const URL = process.env.GOOGLE_SHEETS_URL;
const KEY = process.env.GOOGLE_SHEETS_KEY;

export const sheetsEnabled = Boolean(URL && KEY);

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
  const json = await call({ action: "read" });
  return json.data as DB;
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

export async function writeSettings(settings: Settings): Promise<void> {
  await call({ action: "settings", value: JSON.stringify(settings) });
}
