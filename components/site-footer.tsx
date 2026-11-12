import { Clock, ExternalLink, MapPin, Phone, Snowflake } from "lucide-react";
import { Logo } from "./logo";
import { PreferencesControls } from "./preferences-controls";
import { rupiah, waLink } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="mt-16 bg-navy-deep pb-28 pt-12 text-white md:pb-8">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-[290px] text-sm leading-relaxed text-white/65">
              Frozen food siap masak. Ambil di toko atau minta diantar ke rumah.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-3">
              <Snowflake size={16} className="text-sky" />
              <span className="text-xs font-medium text-white/75">
                Produk tetap beku sampai diterima
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
              Bantuan
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>
                <a
                  href={waLink(settings.telepon, "Halo Yanti Frozen, saya mau bertanya.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <Phone size={15} className="mt-0.5 flex-none text-sky" />
                  <span>
                    WhatsApp toko
                    <span className="block text-xs text-white/45">Balas 08.00–21.00</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 flex-none text-sky" />
                {settings.mapsUrl ? (
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {settings.alamat}
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-white/45">
                      Buka di Google Maps <ExternalLink size={11} />
                    </span>
                  </a>
                ) : (
                  <span>{settings.alamat}</span>
                )}
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="mt-0.5 flex-none text-sky" />
                <span>Buka setiap hari {settings.jamBuka}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
              Pembayaran & pengiriman
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Tunai", "QRIS", "Transfer"].map((p) => (
                <span
                  key={p}
                  className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/85"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Ambil di toko atau antar kurir area Probolinggo. Ongkir{" "}
              {rupiah(settings.ongkir)}, gratis di atas{" "}
              {rupiah(settings.gratisOngkirMin)}.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-1 md:hidden">
          <PreferencesControls layout="gelap" />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Yanti Frozen. Semua hak dilindungi.</p>
          <div className="flex items-center gap-4">
            <span>Probolinggo, Jawa Timur</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
