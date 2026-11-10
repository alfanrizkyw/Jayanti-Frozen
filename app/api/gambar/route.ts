import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export const runtime = "nodejs";

const POLA = /^(qris|promo|produk)\/[A-Za-z0-9._-]+$/;
const CACHE = "public, max-age=31536000, s-maxage=31536000, immutable";

export async function GET(req: Request) {
  const pathname = new URL(req.url).searchParams.get("p") ?? "";
  if (!POLA.test(pathname)) return new NextResponse("Not found", { status: 404 });
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN)
    return new NextResponse("Not found", { status: 404 });

  const hasil = await get(pathname, {
    access: "private",
    ifNoneMatch: req.headers.get("if-none-match") ?? undefined,
  }).catch(() => null);

  if (!hasil) return new NextResponse("Not found", { status: 404 });
  if (hasil.statusCode === 304)
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: hasil.blob.etag, "Cache-Control": CACHE },
    });

  return new NextResponse(hasil.stream, {
    headers: {
      "Content-Type": hasil.blob.contentType,
      "Content-Length": String(hasil.blob.size),
      "X-Content-Type-Options": "nosniff",
      ETag: hasil.blob.etag,
      "Cache-Control": CACHE,
    },
  });
}
