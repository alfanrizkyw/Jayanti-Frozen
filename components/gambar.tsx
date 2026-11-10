import Image, { type ImageProps } from "next/image";
import { gambarTeroptimasi } from "@/lib/format";

/**
 * next/image dengan pengaman: tautan dari host yang belum terdaftar dimuat
 * langsung oleh browser (unoptimized) agar gambar tidak putus.
 */
export function Gambar(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return (
    <Image
      {...props}
      unoptimized={props.unoptimized ?? !gambarTeroptimasi(src)}
    />
  );
}
