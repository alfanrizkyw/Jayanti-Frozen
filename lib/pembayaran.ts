import type { Fulfillment, PaymentMethod } from "./types";

/** Tunai hanya berlaku saat pembeli mengambil pesanan di toko. */
export function tunaiDiizinkan(metode: Fulfillment) {
  return metode === "ambil";
}

export function metodeBayarSah(
  metode: Fulfillment,
  pembayaran: PaymentMethod,
) {
  return pembayaran !== "tunai" || tunaiDiizinkan(metode);
}

export function perluKonfirmasiBayar(
  pembayaran: PaymentMethod,
  dibayar: boolean,
) {
  return pembayaran !== "tunai" && !dibayar;
}

export const PESAN_ANTAR_NON_TUNAI =
  "Antar ke rumah hanya bisa dibayar QRIS atau transfer. Tunai hanya untuk ambil di toko.";

export const PESAN_BAYAR_DULU =
  "Konfirmasi pembayaran dulu sebelum pesanan diproses.";
