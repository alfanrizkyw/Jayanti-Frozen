"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Lang, Theme } from "@/lib/i18n";

const KUNCI_BAHASA = "jayanti-bahasa";
const KUNCI_TEMA = "jayanti-tema";

type Preferensi = {
  lang: Lang;
  theme: Theme;
  ready: boolean;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  toggleLang: () => void;
  toggleTheme: () => void;
};

const Konteks = createContext<Preferensi | null>(null);

function bacaTema(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function bacaBahasa(): Lang {
  try {
    return window.localStorage.getItem(KUNCI_BAHASA) === "en" ? "en" : "id";
  } catch {
    return "id";
  }
}

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("id");
  const [theme, setThemeState] = useState<Theme>("light");
  const [siap, setSiap] = useState(false);
  const pewaktu = useRef<number | undefined>(undefined);

  useEffect(() => {
    setThemeState(bacaTema());
    setLangState(bacaBahasa());
    setSiap(true);
  }, []);

  useEffect(() => {
    if (!siap) return;
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(KUNCI_BAHASA, lang);
    } catch {
      /* penyimpanan bisa diblokir */
    }
  }, [lang, siap]);

  useEffect(() => {
    if (!siap) return;
    try {
      window.localStorage.setItem(KUNCI_TEMA, theme);
    } catch {
      /* penyimpanan bisa diblokir */
    }
  }, [theme, siap]);

  useEffect(
    () => () => {
      window.clearTimeout(pewaktu.current);
    },
    [],
  );

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.add("tema-anim");
    window.clearTimeout(pewaktu.current);
    pewaktu.current = window.setTimeout(
      () => root.classList.remove("tema-anim"),
      460,
    );
    root.dataset.theme = next;
    setThemeState(next);
  }, []);

  const nilai = useMemo<Preferensi>(
    () => ({
      lang,
      theme,
      ready: siap,
      setLang: setLangState,
      setTheme,
      toggleLang: () => setLangState((v) => (v === "id" ? "en" : "id")),
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [lang, siap, theme, setTheme],
  );

  return <Konteks.Provider value={nilai}>{children}</Konteks.Provider>;
}

export function usePreferences(): Preferensi {
  const nilai = useContext(Konteks);
  if (!nilai) {
    throw new Error("usePreferences harus dipakai di dalam PreferencesProvider");
  }
  return nilai;
}
