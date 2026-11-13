/** Alamat situs publik, dipakai untuk tautan admin dan tautan tugas kurir. */
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
