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
  add: (product: AddInput, jumlah?: number) => void;
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

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const add = useCallback(
    (product: AddInput, jumlah = 1) => {
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
      showToast(`${product.nama} ditambahkan ke keranjang`);
    },
    [showToast],
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
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4 md:bottom-28"
      >
        {toast && (
          <div className="rise flex items-center gap-2.5 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white shadow-lift">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf text-[11px]">
              ✓
            </span>
            {toast}
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
