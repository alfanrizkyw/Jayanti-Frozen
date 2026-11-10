import { getSettings } from "./data";
import { normalTelepon, rupiah, tanggalJam } from "./format";
import { PAYMENT_LABEL, type Order, type OrderItem } from "./types";

export function situsUrl(origin?: string): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    origin ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

function susunPesan(
  order: Order,
  items: OrderItem[],
  nomorToko: string,
  tautan: string,
) {
  const isi = items
    .slice(0, 6)
    .map((i) => `${i.jumlah}× ${i.nama}`)
    .join(", ");
  const lebih = items.length > 6 ? `, +${items.length - 6} item lain` : "";
  const bayar = PAYMENT_LABEL[order.pembayaran] ?? order.pembayaran;
  const statusBayar = order.dibayar ? "Lunas" : "Belum lunas";
  const terima =
    order.metode === "antar"
      ? `Antar — ${order.alamat || "alamat belum diisi"}`
      : "Ambil di toko";

  return [
    "*PESANAN BARU — Jayanti Frozen*",
    "",
    `Kode: ${order.kode}`,
    `Pelanggan: ${order.pelanggan}`,
    `No HP: ${order.telepon}`,
    `Total: ${rupiah(order.total)}`,
    `Pembayaran: ${bayar} (${statusBayar})`,
    `Terima: ${terima}`,
    `Jadwal: ${order.jadwal}`,
    `Waktu: ${tanggalJam(order.dibuat)}`,
    "",
    `Isi: ${isi}${lebih}`,
    order.catatan ? `Catatan: ${order.catatan}` : null,
    "",
    "Buka dan konfirmasi pesanan:",
    tautan,
    "",
    "Setelah dikonfirmasi, pesanan antar otomatis masuk ke halaman kurir.",
    `Toko: wa.me/${normalTelepon(nomorToko)}`,
  ]
    .filter((baris) => baris !== null)
    .join("\n");
}

async function kirimFonnte(token: string, target: string, pesan: string) {
  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ target, message: pesan, delay: "1" }),
    signal: AbortSignal.timeout(6_000),
  });
  if (!res.ok) throw new Error(`Fonnte ${res.status}`);
  const json = (await res.json().catch(() => null)) as
    | { status?: boolean; reason?: string }
    | null;
  if (json && json.status === false)
    throw new Error(json.reason || "Fonnte menolak pesan");
}

async function kirimCloudApi(
  token: string,
  phoneId: string,
  target: string,
  pesan: string,
) {
  const res = await fetch(
    `https://graph.facebook.com/v20.0/${encodeURIComponent(phoneId)}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: target,
        type: "text",
        text: { preview_url: true, body: pesan },
      }),
      signal: AbortSignal.timeout(6_000),
    },
  );
  if (!res.ok) throw new Error(`WhatsApp Cloud API ${res.status}`);
}

/**
 * Kirim notifikasi pesanan baru ke WhatsApp admin. Jika token penyedia belum
 * diisi, pesanan tetap tersimpan dan fungsi ini hanya mencatat alasan.
 */
export async function kirimNotifPesanan(
  order: Order,
  items: OrderItem[],
  origin?: string,
): Promise<{ terkirim: boolean; alasan?: string }> {
  try {
    const settings = await getSettings();
    const target = normalTelepon(
      process.env.WHATSAPP_ADMIN || settings.whatsappAdmin,
    );
    if (!target) return { terkirim: false, alasan: "Nomor admin belum diisi." };

    const tautan = `${situsUrl(origin)}/admin/pesanan/${encodeURIComponent(order.kode)}`;
    const pesan = susunPesan(order, items, settings.telepon, tautan);

    if (process.env.FONNTE_TOKEN) {
      await kirimFonnte(process.env.FONNTE_TOKEN, target, pesan);
      return { terkirim: true };
    }
    if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      await kirimCloudApi(
        process.env.WHATSAPP_TOKEN,
        process.env.WHATSAPP_PHONE_NUMBER_ID,
        target,
        pesan,
      );
      return { terkirim: true };
    }

    console.info(
      "[jayanti] Notifikasi WhatsApp dilewati: isi FONNTE_TOKEN atau WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID.",
    );
    return { terkirim: false, alasan: "Token WhatsApp belum diisi." };
  } catch (err) {
    console.error("[jayanti] Gagal mengirim notifikasi WhatsApp:", err);
    return {
      terkirim: false,
      alasan: err instanceof Error ? err.message : "Gagal mengirim notifikasi.",
    };
  }
}
