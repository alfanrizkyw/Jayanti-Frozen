export type OrderStatus =
  | "baru"
  | "dikonfirmasi"
  | "disiapkan"
  | "siap"
  | "diantar"
  | "selesai"
  | "batal";

export type PaymentMethod = "tunai" | "qris" | "transfer";
export type Fulfillment = "ambil" | "antar";

export interface User {
  id: string;
  nama: string;
  telepon: string;
  alamat: string;
  dibuat: string;
}

export interface Product {
  id: string;
  nama: string;
  slug: string;
  kategori: string;
  harga: number;
  hargaPromo: number | null;
  satuan: string;
  stok: number;
  deskripsi: string;
  gambar: string;
  unggulan: boolean;
  aktif: boolean;
  dibuat: string;
}

export interface Order {
  id: string;
  kode: string;
  userId: string;
  pelanggan: string;
  telepon: string;
  alamat: string;
  catatan: string;
  metode: Fulfillment;
  pembayaran: PaymentMethod;
  dibayar: boolean;
  ongkir: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  kurirId: string;
  jadwal: string;
  dibuat: string;
  diperbarui: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  produkId: string;
  nama: string;
  harga: number;
  jumlah: number;
  satuan: string;
  gambar: string;
}

export interface Courier {
  id: string;
  nama: string;
  telepon: string;
  sandi: string;
  kendaraan: string;
  status: "siap" | "mengantar" | "off";
  online: boolean;
  rating: number;
  aktif: boolean;
}

/** Data kurir yang aman dikirim ke browser (tanpa sandi). */
export type CourierPublic = Omit<Courier, "sandi">;

export type StaffRole = "admin" | "kurir";

export interface Staff {
  id: string;
  nama: string;
  peran: StaffRole;
  telepon: string;
  sandi: string;
  aktif: boolean;
  dibuat: string;
}

export type StaffPublic = Omit<Staff, "sandi">;

export type BugStatus = "baru" | "diproses" | "selesai";

export interface Bug {
  id: string;
  pesan: string;
  halaman: string;
  peran: string;
  status: BugStatus;
  dibuat: string;
  diperbarui: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  kurirId: string;
  status: "ditugaskan" | "aktif" | "selesai";
  mulai: string;
  selesai: string;
  lat: number | null;
  lng: number | null;
  diperbarui: string;
  estimasiMenit: number;
}

export interface Promotion {
  id: string;
  tipe: "banner" | "pengumuman";
  judul: string;
  deskripsi: string;
  badge: string;
  gambar: string;
  cta: string;
  aktif: boolean;
  mulai: string;
  selesai: string;
}

export interface Settings {
  namaToko: string;
  telepon: string;
  alamat: string;
  jamBuka: string;
  ongkir: number;
  gratisOngkirMin: number;
  rekening: string;
  atasNama: string;
  qrisNama: string;
  estimasiAntar: number;
  whatsappAdmin: string;
  /** Admin dapat menutup toko kapan saja. */
  tokoBuka: boolean;
  /** Keterangan yang tampil saat toko tutup. */
  tutupCatatan: string;
  /** Slot jadwal kirim/ambil yang bisa dipilih pembeli. */
  jadwalKirim: string[];
}

export interface DB {
  users: User[];
  products: Product[];
  orders: Order[];
  orderItems: OrderItem[];
  couriers: Courier[];
  deliveries: Delivery[];
  promotions: Promotion[];
  staff: Staff[];
  bugs: Bug[];
  settings: Settings;
}

export interface SessionUser {
  role: "admin" | "kurir" | "developer";
  nama: string;
  telepon?: string;
  id?: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  baru: "Pesanan masuk",
  dikonfirmasi: "Pembayaran dikonfirmasi",
  disiapkan: "Sedang disiapkan",
  siap: "Siap diambil",
  diantar: "Sedang diantar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  tunai: "Tunai / bayar di toko",
  qris: "QRIS",
  transfer: "Transfer bank",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  baru: "amber",
  dikonfirmasi: "blue",
  disiapkan: "blue",
  siap: "teal",
  diantar: "blue",
  selesai: "green",
  batal: "slate",
};
