import { createHmac, timingSafeEqual } from "crypto";
import { kunciServer } from "./auth";
import { courierFinish, courierLocation } from "./data";
import { simpanBukti } from "./bukti";
import { situsUrl } from "./situs";
import { readDB } from "./store";
import type { DB, Order } from "./types";

/**
 * Link tugas kurir ditandatangani per pesanan, tidak disimpan di database.
 * Link mati sendiri begitu status pesanan tidak lagi "diantar".
 */

export const PANJANG_TOKEN = 24;

export function tokenTugas(order: Pick<Order, "id">): string {
  return createHmac("sha256", kunciServer())
    .update(`tugas-kurir:${order.id}`)
    .digest("base64url")
    .slice(0, PANJANG_TOKEN);
}

export function tautanTugas(order: Pick<Order, "id">, origin?: string): string {
  return `${situsUrl(origin)}/antar/${tokenTugas(order)}`;
}

function tokenCocok(token: string, order: Order) {
  const milik = tokenTugas(order);
  if (token.length !== milik.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(milik));
}

async function cariTugas(token: string, segar = false) {
  const bersih = token.trim();
  if (bersih.length !== PANJANG_TOKEN) return null;
  const cocokDi = (db: DB) => {
    const order = db.orders.find((o) => tokenCocok(bersih, o));
    return order ? { order, db } : null;
  };
  // Halaman tugas memakai data terbaru supaya link langsung mati begitu
  // pesanan selesai. Aksi GPS tetap memakai cache agar tidak membebani Sheets.
  if (segar) {
    return cocokDi(await readDB(true)) ?? cocokDi(await readDB());
  }
  return cocokDi(await readDB()) ?? cocokDi(await readDB(true));
}

export interface ItemTugas {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
}

/** Hanya data yang dibutuhkan kurir. Tanpa nominal, tanpa pesanan lain. */
export interface TugasKurir {
  token: string;
  kode: string;
  pelanggan: string;
  telepon: string;
  alamat: string;
  lat: number | null;
  lng: number | null;
  catatan: string;
  items: ItemTugas[];
  mulai: string;
  estimasiMenit: number;
  namaToko: string;
  waToko: string;
}

export type HasilTugasKurir =
  | { state: "aktif"; tugas: TugasKurir }
  | { state: "belum" }
  | { state: "selesai" }
  | { state: "tidak-ada" };

export async function getTugasKurir(token: string): Promise<HasilTugasKurir> {
  const hasil = await cariTugas(token, true);
  if (!hasil) return { state: "tidak-ada" };
  const { order, db } = hasil;
  if (order.status === "selesai" || order.status === "batal")
    return { state: "selesai" };
  if (order.status !== "diantar") return { state: "belum" };

  const delivery = db.deliveries.find((d) => d.orderId === order.id);
  return {
    state: "aktif",
    tugas: {
      token: tokenTugas(order),
      kode: order.kode,
      pelanggan: order.pelanggan,
      telepon: order.telepon,
      alamat: order.alamat,
      lat: order.lat,
      lng: order.lng,
      catatan: order.catatan,
      items: db.orderItems
        .filter((i) => i.orderId === order.id)
        .map((i) => ({ id: i.id, nama: i.nama, jumlah: i.jumlah, satuan: i.satuan })),
      mulai: delivery?.mulai ?? "",
      estimasiMenit: delivery?.estimasiMenit ?? db.settings.estimasiAntar,
      namaToko: db.settings.namaToko,
      waToko: db.settings.telepon,
    },
  };
}

export async function simpanLokasiTugas(token: string, lat: number, lng: number) {
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  )
    throw new Error("Koordinat tidak valid.");
  const hasil = await cariTugas(token);
  if (!hasil || hasil.order.status !== "diantar")
    throw new Error("Tugas antar sudah tidak aktif.");
  await courierLocation(lat, lng, hasil.order.kode);
}

export async function simpanBuktiTugas(token: string, jpeg: Buffer) {
  const hasil = await cariTugas(token);
  if (!hasil) throw new Error("Link tugas tidak dikenali.");
  const { order } = hasil;
  if (order.metode !== "antar") throw new Error("Pesanan ini bukan pengantaran.");
  if (order.status !== "diantar")
    throw new Error("Foto bukti diambil saat pesanan sedang diantar.");
  await simpanBukti(order.id, jpeg);
}

export async function selesaikanTugas(token: string) {
  const hasil = await cariTugas(token);
  if (!hasil) throw new Error("Link tugas tidak dikenali.");
  if (hasil.order.status === "selesai")
    throw new Error("Pesanan ini sudah ditandai diterima.");
  if (hasil.order.status !== "diantar")
    throw new Error("Pesanan belum dalam pengantaran.");
  await courierFinish(hasil.order.kode);
}
