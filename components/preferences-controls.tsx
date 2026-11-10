"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { usePreferences } from "./preferences";

export function PreferencesControls({
  layout = "row",
}: {
  layout?: "row" | "full" | "gelap";
}) {
  const { lang, theme, setLang, toggleLang, toggleTheme } = usePreferences();

  if (layout !== "row") {
    const gelap = layout === "gelap";
    return (
      <div className="flex flex-col gap-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-[12.5px] font-bold ${
              gelap ? "text-white/75" : "text-navy"
            }`}
          >
            Bahasa
          </span>
          <div
            className={`flex rounded-xl border p-1 ${
              gelap ? "border-white/12 bg-white/6" : "border-line bg-paper"
            }`}
          >
            <button
              type="button"
              onClick={() => setLang("id")}
              aria-pressed={lang === "id"}
              data-keep=""
              className={`min-h-10 rounded-lg px-3 text-[12px] font-extrabold transition-colors ${
                lang === "id"
                  ? gelap
                    ? "bg-white/18 text-white"
                    : "bg-white text-brand shadow-sm"
                  : gelap
                    ? "text-white/60 hover:text-white"
                    : "text-muted hover:text-navy"
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              data-keep=""
              className={`min-h-10 rounded-lg px-3 text-[12px] font-extrabold transition-colors ${
                lang === "en"
                  ? gelap
                    ? "bg-white/18 text-white"
                    : "bg-white text-brand shadow-sm"
                  : gelap
                    ? "text-white/60 hover:text-white"
                    : "text-muted hover:text-navy"
              }`}
            >
              English
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-[12.5px] font-bold ${
              gelap ? "text-white/75" : "text-navy"
            }`}
          >
            Tema
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={
              theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"
            }
            className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-[12.5px] font-bold transition-colors ${
              gelap
                ? "border-white/12 bg-white/6 text-white hover:bg-white/10"
                : "border-line bg-white text-navy hover:bg-mist"
            }`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            {theme === "dark" ? "Terang" : "Gelap"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={toggleLang}
        aria-label={
          lang === "id" ? "Ganti bahasa ke Inggris" : "Ganti bahasa ke Indonesia"
        }
        data-keep=""
        className="flex h-11 min-w-11 items-center gap-1 rounded-xl px-2 text-[11px] font-extrabold text-navy transition-colors hover:bg-mist"
      >
        <Languages size={18} strokeWidth={2.1} />
        {lang === "id" ? "ID" : "EN"}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="icon-btn"
        aria-label={
          theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"
        }
      >
        {theme === "dark" ? (
          <Sun size={20} strokeWidth={2.1} />
        ) : (
          <Moon size={20} strokeWidth={2.1} />
        )}
      </button>
    </div>
  );
}
