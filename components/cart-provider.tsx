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

export interface CartLine {
  id: string;
  nama: string;
  slug: string;
  harga: number;
  gambar: string;
  satuan: string;
  stok: number;
  jumlah: number;
}

type AddInput = {
  id: string;
  nama: string;
  slug: string;
  harga: number;
  hargaPromo: number | null;
  gambar: string;
  satuan: string;
  stok: number;
};

interface CartContextValue {
  items: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (product: AddInput, jumlah?: number, asal?: HTMLElement | null) => void;
  setJumlah: (id: string, jumlah: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "jayanti-keranjang-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i?.id));
      }
    } catch {
      /* keranjang lama tidak terbaca */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const terbangkan = useCallback(
    (asal: HTMLElement | null | undefined, gambar: string) => {
      if (!asal || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      const tujuan = Array.from(
        document.querySelectorAll<HTMLElement>("[data-keranjang-target]"),
      ).find((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (!tujuan) return;

      const foto = asal.closest("article")?.querySelector("img");
      const dari = (foto ?? asal).getBoundingClientRect();
      const ke = tujuan.getBoundingClientRect();
      const dx = ke.left + ke.width / 2 - (dari.left + dari.width / 2);
      const dy = ke.top + ke.height / 2 - (dari.top + dari.height / 2);
      const ukuran = 44;

      const node = document.createElement("div");
      node.className = "terbang-keranjang";
      node.setAttribute("aria-hidden", "true");
      node.style.left = `${dari.left + dari.width / 2 - ukuran / 2}px`;
      node.style.top = `${dari.top + dari.height / 2 - ukuran / 2}px`;

      const src = foto?.currentSrc || foto?.src || gambar;
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        node.appendChild(img);
      } else {
        node.textContent = "+";
      }
      document.body.appendChild(node);

      const anim = node.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          {
            transform: `translate(${dx * 0.42}px, ${dy * 0.42 - 76}px) scale(0.62)`,
            opacity: 1,
            offset: 0.55,
          },
          { transform: `translate(${dx}px, ${dy}px) scale(0.16)`, opacity: 0.55 },
        ],
        { duration: 680, easing: "cubic-bezier(0.35, 0.7, 0.4, 1)" },
      );
      anim.onfinish = () => {
        node.remove();
        tujuan.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.18)" },
            { transform: "scale(1)" },
          ],
          { duration: 320, easing: "ease-out" },
        );
      };
      anim.oncancel = () => node.remove();
    },
    [],
  );

  const add = useCallback(
    (product: AddInput, jumlah = 1, asal?: HTMLElement | null) => {
      setItems((prev) => {
        const harga = product.hargaPromo ?? product.harga;
        const ada = prev.find((i) => i.id === product.id);
        if (ada) {
          const next = Math.min(ada.jumlah + jumlah, Math.max(product.stok, 0));
          return prev.map((i) =>
            i.id === product.id
              ? { ...i, jumlah: next, stok: product.stok, harga }
              : i,
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            nama: product.nama,
            slug: product.slug,
            harga,
            gambar: product.gambar,
            satuan: product.satuan,
            stok: product.stok,
            jumlah: Math.min(Math.max(jumlah, 1), Math.max(product.stok, 1)),
          },
        ];
      });
      terbangkan(asal, product.gambar);
      showToast(`${product.nama} ditambahkan ke keranjang`);
    },
    [showToast, terbangkan],
  );

  const setJumlah = useCallback((id: string, jumlah: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, jumlah: Math.min(Math.max(1, jumlah), Math.max(i.stok, 1)) }
          : i,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((a, b) => a + b.jumlah, 0);
    const subtotal = items.reduce((a, b) => a + b.harga * b.jumlah, 0);
    return { items, ready, count, subtotal, add, setJumlah, remove, clear };
  }, [items, ready, add, setJumlah, remove, clear]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {toast}
      </p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
