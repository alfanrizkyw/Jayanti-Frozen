"use client";

import { useEffect, useRef } from "react";
import { ATURAN_ATRIBUT, terjemahkan, type Lang } from "@/lib/i18n";
import { usePreferences } from "./preferences";

const LEWATI = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "CODE",
  "PRE",
]);

const asliTeks = new WeakMap<Text, string>();
const asliAtribut = new WeakMap<Element, Map<string, string>>();

function lewati(el: Element | null): boolean {
  for (let kini = el; kini; kini = kini.parentElement) {
    if (LEWATI.has(kini.tagName) || kini.hasAttribute("data-keep")) return true;
  }
  return false;
}

function terjemahTeks(node: Text, lang: Lang) {
  const asli = asliTeks.get(node) ?? node.nodeValue ?? "";
  asliTeks.set(node, asli);
  const hasil = terjemahkan(asli, lang);
  if (node.nodeValue !== hasil) node.nodeValue = hasil;
}

function pulihkanTeks(node: Text) {
  const asli = asliTeks.get(node);
  if (asli !== undefined && node.nodeValue !== asli) node.nodeValue = asli;
}

function terjemahAtribut(el: Element, lang: Lang) {
  let simpanan = asliAtribut.get(el);
  for (const nama of ATURAN_ATRIBUT) {
    const nilai = el.getAttribute(nama);
    if (nilai === null) continue;
    if (!simpanan) {
      simpanan = new Map<string, string>();
      asliAtribut.set(el, simpanan);
    }
    if (!simpanan.has(nama)) simpanan.set(nama, nilai);
    const asli = simpanan.get(nama) ?? nilai;
    const hasil = terjemahkan(asli, lang);
    if (nilai !== hasil) el.setAttribute(nama, hasil);
  }
}

function pulihkanAtribut(el: Element) {
  const simpanan = asliAtribut.get(el);
  if (!simpanan) return;
  for (const [nama, asli] of simpanan) {
    if (el.getAttribute(nama) !== asli) el.setAttribute(nama, asli);
  }
}

function prosesSimpul(simpul: Node, lang: Lang) {
  if (simpul.nodeType === Node.TEXT_NODE) {
    const teks = simpul as Text;
    if (!lewati(teks.parentElement)) terjemahTeks(teks, lang);
    return;
  }
  if (simpul.nodeType !== Node.ELEMENT_NODE) return;
  const el = simpul as Element;
  if (lewati(el)) return;
  terjemahAtribut(el, lang);
  const jalan = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let kini = jalan.nextNode();
  while (kini) {
    if (kini.nodeType === Node.TEXT_NODE) {
      const teks = kini as Text;
      if (!lewati(teks.parentElement)) terjemahTeks(teks, lang);
    } else if (!lewati(kini as Element)) {
      terjemahAtribut(kini as Element, lang);
    }
    kini = jalan.nextNode();
  }
}

function sapuSemua(lang: Lang) {
  const jalan = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
  );
  let kini = jalan.nextNode();
  while (kini) {
    if (kini.nodeType === Node.TEXT_NODE) {
      const teks = kini as Text;
      if (!lewati(teks.parentElement)) {
        if (lang === "id") pulihkanTeks(teks);
        else terjemahTeks(teks, lang);
      }
    } else {
      const el = kini as Element;
      if (!lewati(el)) {
        if (lang === "id") pulihkanAtribut(el);
        else terjemahAtribut(el, lang);
      }
    }
    kini = jalan.nextNode();
  }
}

export function AutoTranslate() {
  const { lang, ready } = usePreferences();
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    if (!ready) return;
    sapuSemua(lang);
  }, [lang, ready]);

  useEffect(() => {
    let antre: MutationRecord[] = [];
    let frame: number | null = null;

    function proses(mutasi: MutationRecord[]) {
      const aktif = langRef.current;
      if (aktif === "id") return;
      for (const m of mutasi) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => prosesSimpul(n, aktif));
          continue;
        }
        if (m.type === "characterData") {
          const t = m.target as Text;
          if (lewati(t.parentElement)) continue;
          const asli = asliTeks.get(t);
          const kini = t.nodeValue ?? "";
          if (asli !== undefined && kini === terjemahkan(asli, aktif)) continue;
          asliTeks.set(t, kini);
          const hasil = terjemahkan(kini, aktif);
          if (kini !== hasil) t.nodeValue = hasil;
          continue;
        }
        if (m.type === "attributes" && m.attributeName && m.target) {
          const el = m.target as Element;
          if (lewati(el)) continue;
          const nama = m.attributeName as (typeof ATURAN_ATRIBUT)[number];
          if (!ATURAN_ATRIBUT.includes(nama)) continue;
          const kini = el.getAttribute(nama);
          if (kini === null) continue;
          const simpanan = asliAtribut.get(el) ?? new Map<string, string>();
          if (!asliAtribut.has(el)) asliAtribut.set(el, simpanan);
          const asli = simpanan.get(nama);
          if (asli !== undefined && kini === terjemahkan(asli, aktif)) continue;
          simpanan.set(nama, kini);
          const hasil = terjemahkan(kini, aktif);
          if (kini !== hasil) el.setAttribute(nama, hasil);
        }
      }
    }

    const pengamat = new MutationObserver((mutasi) => {
      // Bahasa Indonesia adalah teks asli halaman: tidak perlu diproses.
      if (langRef.current === "id") return;
      antre.push(...mutasi);
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const daftar = antre;
        antre = [];
        proses(daftar);
      });
    });

    pengamat.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATURAN_ATRIBUT],
    });
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      pengamat.disconnect();
    };
  }, []);

  return null;
}
