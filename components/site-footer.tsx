import { Clock, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { WhatsAppIcon } from "./whatsapp-icon";
import { waLink } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <div className="mt-14 text-navy-deep md:mt-20">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-10 w-full md:h-16"
        fill="currentColor"
      >
        <path d="M0 52c210 34 380-30 640-8 260 22 470 52 800 2v34H0V52Z" />
      </svg>

      <footer className="relative overflow-hidden bg-navy-deep pb-9 pt-6 text-white md:pt-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_100%_0%,rgba(114,185,238,0.16),transparent_65%)]"
        />

        <div className="container-page relative">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-start md:gap-14">
            <div>
              <Logo tone="light" size={48} />
              <p className="mt-4 max-w-[300px] text-[13px] leading-relaxed text-white/60">
                Frozen food siap masak dari Probolinggo. Ambil di toko atau
                minta diantar ke rumah.
              </p>
              <a
                href={waLink(
                  settings.telepon,
                  "Halo Yanti Frozen, saya mau bertanya.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-white/12"
              >
                <WhatsAppIcon size={16} className="text-sky" />
                WhatsApp toko
              </a>
            </div>

            <ul className="grid gap-4 text-[13px] sm:grid-cols-2 md:grid-cols-1">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white/[0.06] text-sky">
                  <Clock size={16} />
                </span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                    Jam operasional
                  </span>
                  <span className="mt-0.5 block text-white/80">
                    Buka setiap hari {settings.jamBuka}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white/[0.06] text-sky">
                  <MapPin size={16} />
                </span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
                    Lokasi
                  </span>
                  <span className="mt-0.5 block leading-relaxed text-white/80">
                    Probolinggo, Jawa Timur
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Yanti Frozen. Semua hak dilindungi.</p>
            <p>Ambil di toko atau antar kurir area Probolinggo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
