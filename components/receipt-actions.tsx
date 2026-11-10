"use client";

import { useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { rupiah, tanggalJam, teleponRapi } from "@/lib/format";
import {
  PAYMENT_LABEL,
  type Order,
  type OrderItem,
  type Settings,
} from "@/lib/types";

const LEBAR = 720;
const PAD = 40;
const FONT = '"Segoe UI", Roboto, Arial, sans-serif';
const NAVY = "#102B50";
const MUTED = "#5B6B7F";
const LINE = "#D7E1EC";

function potong(ctx: CanvasRenderingContext2D, teks: string, maks: number) {
  if (ctx.measureText(teks).width <= maks) return teks;
  let hasil = teks;
  while (hasil.length > 1 && ctx.measureText(`${hasil}…`).width > maks)
    hasil = hasil.slice(0, -1);
  return `${hasil}…`;
}

function bungkus(
  ctx: CanvasRenderingContext2D,
  teks: string,
  maks: number,
): string[] {
  const kata = teks.split(/\s+/);
  const baris: string[] = [];
  let kini = "";
  for (const k of kata) {
    const coba = kini ? `${kini} ${k}` : k;
    if (ctx.measureText(coba).width <= maks) kini = coba;
    else {
      if (kini) baris.push(kini);
      kini = k;
    }
  }
  if (kini) baris.push(kini);
  return baris.length ? baris : [""];
}

async function buatNota(
  order: Order,
  items: OrderItem[],
  settings: Settings,
): Promise<Blob> {
  const skala = 2;
  const kanvas = document.createElement("canvas");
  kanvas.width = LEBAR * skala;
  kanvas.height = 2400 * skala;
  const ctx = kanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia.");
  ctx.scale(skala, skala);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, LEBAR, 2400);

  const tengah = LEBAR / 2;
  let y = PAD + 12;

  ctx.textAlign = "center";
  ctx.fillStyle = NAVY;
  ctx.font = `800 30px ${FONT}`;
  ctx.fillText(settings.namaToko || "Jayanti Frozen", tengah, y);
  y += 26;
  ctx.fillStyle = MUTED;
  ctx.font = `400 15px ${FONT}`;
  for (const baris of bungkus(ctx, settings.alamat, LEBAR - PAD * 2)) {
    ctx.fillText(baris, tengah, y);
    y += 21;
  }
  ctx.fillText(teleponRapi(settings.telepon), tengah, y);
  y += 26;

  ctx.strokeStyle = LINE;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(LEBAR - PAD, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 34;

  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.font = `700 12px ${FONT}`;
  ctx.fillText("NOTA PESANAN", PAD, y);
  ctx.textAlign = "right";
  ctx.fillText(tanggalJam(order.dibuat).toUpperCase(), LEBAR - PAD, y);
  y += 30;

  ctx.textAlign = "left";
  ctx.fillStyle = NAVY;
  ctx.font = `800 24px ${FONT}`;
  ctx.fillText(order.kode, PAD, y);
  y += 30;

  ctx.font = `400 15px ${FONT}`;
  ctx.fillStyle = NAVY;
  ctx.fillText(`Penerima: ${order.pelanggan}`, PAD, y);
  y += 22;
  ctx.fillStyle = MUTED;
  ctx.fillText(`HP: ${teleponRapi(order.telepon)}`, PAD, y);
  y += 22;
  ctx.fillText(
    `${order.metode === "antar" ? "Antar ke rumah" : "Ambil di toko"} · ${order.jadwal}`,
    PAD,
    y,
  );
  y += 22;
  if (order.metode === "antar" && order.alamat) {
    for (const baris of bungkus(ctx, `Alamat: ${order.alamat}`, LEBAR - PAD * 2)) {
      ctx.fillText(baris, PAD, y);
      y += 21;
    }
  }
  y += 12;

  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(LEBAR - PAD, y);
  ctx.stroke();
  y += 28;

  const kanan = LEBAR - PAD;
  const kiriHarga = kanan - 120;
  ctx.fillStyle = MUTED;
  ctx.font = `700 12px ${FONT}`;
  ctx.fillText("PRODUK", PAD, y);
  ctx.textAlign = "right";
  ctx.fillText("JUMLAH", kiriHarga, y);
  ctx.fillText("TOTAL", kanan, y);
  ctx.textAlign = "left";
  y += 12;
  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(LEBAR - PAD, y);
  ctx.stroke();
  y += 26;

  for (const item of items) {
    ctx.fillStyle = NAVY;
    ctx.font = `600 15px ${FONT}`;
    ctx.fillText(potong(ctx, item.nama, kiriHarga - PAD - 20), PAD, y);
    ctx.textAlign = "right";
    ctx.font = `400 14px ${FONT}`;
    ctx.fillStyle = MUTED;
    ctx.fillText(String(item.jumlah), kiriHarga, y);
    ctx.fillStyle = NAVY;
    ctx.font = `600 15px ${FONT}`;
    ctx.fillText(rupiah(item.harga * item.jumlah), kanan, y);
    ctx.textAlign = "left";
    y += 19;
    ctx.fillStyle = MUTED;
    ctx.font = `400 12px ${FONT}`;
    ctx.fillText(
      `${rupiah(item.harga)} · ${item.satuan}`,
      PAD,
      y,
    );
    y += 26;
  }

  ctx.strokeStyle = LINE;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(LEBAR - PAD, y);
  ctx.stroke();
  y += 26;

  const totalBaris = (
    label: string,
    nilai: string,
    tebal = false,
  ) => {
    ctx.fillStyle = tebal ? NAVY : MUTED;
    ctx.font = `${tebal ? 800 : 400} ${tebal ? 19 : 15}px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(label, PAD, y);
    ctx.textAlign = "right";
    ctx.fillStyle = NAVY;
    ctx.fillText(nilai, kanan, y);
    ctx.textAlign = "left";
    y += tebal ? 32 : 25;
  };

  totalBaris("Subtotal", rupiah(order.subtotal));
  totalBaris(
    `Ongkir (${order.metode === "antar" ? "antar kurir" : "ambil sendiri"})`,
    order.ongkir === 0 ? "Gratis" : rupiah(order.ongkir),
  );
  totalBaris("Total", rupiah(order.total), true);

  ctx.fillStyle = MUTED;
  ctx.font = `400 14px ${FONT}`;
  ctx.fillText(
    `Pembayaran: ${PAYMENT_LABEL[order.pembayaran]} · ${order.dibayar ? "Lunas" : "Belum dibayar"}`,
    PAD,
    y,
  );
  y += 24;
  if (order.catatan) {
    for (const baris of bungkus(ctx, `Catatan: ${order.catatan}`, LEBAR - PAD * 2)) {
      ctx.fillText(baris, PAD, y);
      y += 21;
    }
  }
  y += 18;

  ctx.strokeStyle = LINE;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(LEBAR - PAD, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 30;

  ctx.textAlign = "center";
  ctx.fillStyle = NAVY;
  ctx.font = `700 15px ${FONT}`;
  ctx.fillText("Terima kasih sudah berbelanja.", tengah, y);
  y += 22;
  ctx.fillStyle = MUTED;
  ctx.font = `400 13px ${FONT}`;
  ctx.fillText("Simpan nota ini sebagai bukti pesanan.", tengah, y);
  y += PAD;

  const hasil = document.createElement("canvas");
  hasil.width = kanvas.width;
  hasil.height = Math.ceil(y) * skala;
  const ctx2 = hasil.getContext("2d");
  if (!ctx2) throw new Error("Canvas tidak tersedia.");
  ctx2.fillStyle = "#FFFFFF";
  ctx2.fillRect(0, 0, hasil.width, hasil.height);
  ctx2.drawImage(kanvas, 0, 0);

  return await new Promise<Blob>((resolusi, tolak) =>
    hasil.toBlob(
      (blob) => (blob ? resolusi(blob) : tolak(new Error("Nota gagal dibuat."))),
      "image/png",
    ),
  );
}

export function ReceiptActions({
  order,
  items,
  settings,
}: {
  order: Order;
  items: OrderItem[];
  settings: Settings;
}) {
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState("");

  async function simpan() {
    setSibuk(true);
    setPesan("");
    try {
      const blob = await buatNota(order, items, settings);
      const nama = `nota-${order.kode}.png`;
      const file = new File([blob], nama, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Nota ${order.kode}` });
        setPesan("Pilih Simpan gambar untuk menyimpan ke galeri.");
      } else {
        const url = URL.createObjectURL(blob);
        const tautan = document.createElement("a");
        tautan.href = url;
        tautan.download = nama;
        document.body.appendChild(tautan);
        tautan.click();
        tautan.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        setPesan("Nota tersimpan di folder unduhan.");
      }
      setTimeout(() => setPesan(""), 5000);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setPesan("Nota gagal dibuat. Coba lagi.");
      setTimeout(() => setPesan(""), 5000);
    } finally {
      setSibuk(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={simpan}
        disabled={sibuk}
        className="btn btn-outline btn-sm"
        title="Simpan nota ke galeri atau folder unduhan"
      >
        {sibuk ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        {sibuk ? "Menyiapkan…" : "Simpan nota"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="btn btn-outline btn-sm"
      >
        <Printer size={14} />
        Cetak
      </button>
      {pesan && (
        <span role="status" className="self-center text-[11px] font-semibold text-leaf">
          {pesan}
        </span>
      )}

      <div className="nota-cetak" aria-hidden="true">
        <div style={{ fontFamily: FONT, color: NAVY, maxWidth: 640 }}>
          <div style={{ textAlign: "center", paddingBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
              {settings.namaToko || "Jayanti Frozen"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: MUTED }}>
              {settings.alamat}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
              {teleponRapi(settings.telepon)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: `1px dashed ${LINE}`,
              borderBottom: `1px dashed ${LINE}`,
              padding: "10px 0",
              fontSize: 12,
              color: MUTED,
            }}
          >
            <span>NOTA PESANAN</span>
            <span>{tanggalJam(order.dibuat)}</span>
          </div>
          <p style={{ margin: "12px 0 2px", fontSize: 22, fontWeight: 800 }}>
            {order.kode}
          </p>
          <p style={{ margin: 0, fontSize: 13 }}>
            Penerima: {order.pelanggan} · {teleponRapi(order.telepon)}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
            {order.metode === "antar" ? "Antar ke rumah" : "Ambil di toko"} ·{" "}
            {order.jadwal}
          </p>
          {order.metode === "antar" && order.alamat && (
            <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
              Alamat: {order.alamat}
            </p>
          )}

          <table
            style={{
              width: "100%",
              marginTop: 14,
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ color: MUTED, textAlign: "left", fontSize: 11 }}>
                <th style={{ padding: "6px 0" }}>PRODUK</th>
                <th style={{ padding: "6px 0", textAlign: "right" }}>JUMLAH</th>
                <th style={{ padding: "6px 0", textAlign: "right" }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderTop: `1px solid ${LINE}` }}>
                  <td style={{ padding: "7px 0" }}>
                    <span style={{ fontWeight: 600 }}>{item.nama}</span>
                    <br />
                    <span style={{ fontSize: 11, color: MUTED }}>
                      {rupiah(item.harga)} · {item.satuan}
                    </span>
                  </td>
                  <td style={{ padding: "7px 0", textAlign: "right" }}>
                    {item.jumlah}
                  </td>
                  <td style={{ padding: "7px 0", textAlign: "right", fontWeight: 600 }}>
                    {rupiah(item.harga * item.jumlah)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 12,
              borderTop: `1px solid ${LINE}`,
              paddingTop: 10,
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: MUTED }}>Subtotal</span>
              <span>{rupiah(order.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: MUTED }}>
                Ongkir ({order.metode === "antar" ? "antar kurir" : "ambil sendiri"})
              </span>
              <span>{order.ongkir === 0 ? "Gratis" : rupiah(order.ongkir)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span>{rupiah(order.total)}</span>
            </div>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 12, color: MUTED }}>
            Pembayaran: {PAYMENT_LABEL[order.pembayaran]} ·{" "}
            {order.dibayar ? "Lunas" : "Belum dibayar"}
          </p>
          {order.catatan && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: MUTED }}>
              Catatan: {order.catatan}
            </p>
          )}
          <p
            style={{
              margin: "18px 0 0",
              paddingTop: 12,
              borderTop: `1px dashed ${LINE}`,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Terima kasih sudah berbelanja.
          </p>
          <p
            style={{
              margin: "2px 0 0",
              textAlign: "center",
              fontSize: 11,
              color: MUTED,
            }}
          >
            Simpan nota ini sebagai bukti pesanan.
          </p>
        </div>
      </div>
    </>
  );
}
