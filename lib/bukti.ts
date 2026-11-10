import { promises as fs } from "fs";
import path from "path";

export const buktiAktif = Boolean(
  process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN,
);

const FOLDER = "bukti";

function idAman(id: string) {
  return id.replace(/[^A-Za-z0-9_-]/g, "");
}

/** Satu lokasi tetap per pesanan, jadi bukti bisa dicek tanpa kolom baru. */
export function pathnameBukti(orderId: string) {
  return `${FOLDER}/${idAman(orderId)}.jpg`;
}

function fileBukti(orderId: string) {
  return path.join(process.cwd(), ".data", "bukti", `${idAman(orderId)}.jpg`);
}

export async function simpanBukti(orderId: string, jpeg: Buffer): Promise<void> {
  const pathname = pathnameBukti(orderId);
  if (buktiAktif) {
    const { put } = await import("@vercel/blob");
    try {
      await put(pathname, jpeg, {
        access: "public",
        contentType: "image/jpeg",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    } catch (err) {
      // Toko Blob bisa dibuat private; unggah public akan ditolak di sana.
      if (!(err instanceof Error) || !/private store/i.test(err.message)) throw err;
      await put(pathname, jpeg, {
        access: "private",
        contentType: "image/jpeg",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    }
  }

  if (process.env.VERCEL)
    throw new Error("Penyimpanan foto belum aktif. Hubungkan Blob di Vercel.");
  await fs.mkdir(path.dirname(fileBukti(orderId)), { recursive: true });
  await fs.writeFile(fileBukti(orderId), jpeg);
}

export async function buktiAda(orderId: string): Promise<boolean> {
  if (buktiAktif) {
    try {
      const { head } = await import("@vercel/blob");
      await head(pathnameBukti(orderId));
      return true;
    } catch {
      return false;
    }
  }
  try {
    await fs.access(fileBukti(orderId));
    return true;
  } catch {
    return false;
  }
}

export async function bacaBukti(
  orderId: string,
): Promise<{ body: ReadableStream<Uint8Array> | Uint8Array; contentType: string } | null> {
  if (buktiAktif) {
    const { get } = await import("@vercel/blob");
    for (const access of ["private", "public"] as const) {
      try {
        const hasil = await get(pathnameBukti(orderId), { access });
        if (hasil?.stream)
          return {
            body: hasil.stream,
            contentType: hasil.blob.contentType ?? "image/jpeg",
          };
      } catch {
        // Coba mode akses lain sebelum menyatakan tidak ada.
      }
    }
    return null;
  }
  try {
    const isi = await fs.readFile(fileBukti(orderId));
    return { body: isi, contentType: "image/jpeg" };
  } catch {
    return null;
  }
}
