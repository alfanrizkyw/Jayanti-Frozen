"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRefresh({ detik = 60 }: { detik?: number }) {
  const router = useRouter();

  useEffect(() => {
    if (detik <= 0) return;

    function segarkan() {
      if (document.visibilityState === "visible") router.refresh();
    }

    const timer = window.setInterval(segarkan, detik * 1000);
    document.addEventListener("visibilitychange", segarkan);
    window.addEventListener("focus", segarkan);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", segarkan);
      window.removeEventListener("focus", segarkan);
    };
  }, [router, detik]);

  return null;
}
