import { adminPassword, courierPassword } from "./auth";
import { hashPassword, sameSecret, verifyPassword } from "./password";
import {
  readDB,
  rapikanBank,
  saveRows,
  saveAll,
  removeRow,
  saveSettings,
} from "./store";
import { buktiAda } from "./bukti";
import type {
  Bug,
  BugStatus,
  Courier,
  CourierPublic,
  Delivery,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  Promotion,
  Settings,
  Staff,
  StaffPublic,
} from "./types";
import { kodePesanan, normalTelepon, slugify, tautanGambar } from "./format";

export interface OrderDetail {
  order: Order;
  items: OrderItem[];
  delivery: Delivery | null;
  kurir: CourierPublic | null;
  settings: Settings;
}

/** Buang sandi hash sebelum data kurir dikirim ke browser. */
export function courierPublic(courier: Courier): CourierPublic {
  const { sandi: _sandi, ...aman } = courier;
  return aman;
}

export function staffPublic(staff: Staff): StaffPublic {
  const { sandi: _sandi, ...aman } = staff;
  return aman;
}

export async function getSettings(): Promise<Settings> {
  return (await readDB()).settings;
}

export async function getStorefront() {
  const db = await readDB();
  const now = Date.now();
  const aktif = db.promotions.filter(
    (p) =>
      p.aktif &&
      (!p.mulai || new Date(p.mulai).getTime() <= now) &&
      (!p.selesai || new Date(p.selesai).getTime() >= now),
  );
  return {
    products: db.products.filter((p) => p.aktif),
    banner: aktif.find((p) => p.tipe === "banner") ?? null,
    pengumuman: aktif.filter((p) => p.tipe === "pengumuman"),
    settings: db.settings,
  };
}

export async function getProductBySlug(slug: string) {
  const db = await readDB();
  const product = db.products.find((p) => p.slug === slug && p.aktif);
  if (!product) return null;
  const related = db.products
    .filter((p) => p.aktif && p.id !== product.id && p.kategori === product.kategori)
    .slice(0, 4);
  const fallback = db.products
    .filter((p) => p.aktif && p.id !== product.id)
    .slice(0, 4);
  return { product, related: related.length ? related : fallback, settings: db.settings };
}

export async function getOrderDetail(
  kode: string,
  segar = false,
): Promise<OrderDetail | null> {
  const cari = kode.toLowerCase().trim();
  const cocok = (db: Awaited<ReturnType<typeof readDB>>) =>
    db.orders.find((o) => o.kode.toLowerCase() === cari);

  let db = await readDB(segar);
  let order = cocok(db);
  if (!order && !segar) {
    // Instance Vercel lain bisa masih memegang cache lama sesaat setelah
    // checkout. Baca ulang ke Google Sheets sebelum menyatakan tidak ada.
    db = await readDB(true);
    order = cocok(db);
  }
  if (!order) return null;
  const kurir = db.couriers.find((c) => c.id === order.kurirId);
  return {
    order,
    items: db.orderItems.filter((i) => i.orderId === order.id),
    delivery: db.deliveries.find((d) => d.orderId === order.id) ?? null,
    kurir: kurir ? courierPublic(kurir) : null,
    settings: db.settings,
  };
}

export async function getAdminData() {
  const db = await readDB();
  return db;
}

export async function getCourierData() {
  const db = await readDB();
  const tim = db.couriers.filter((c) => c.aktif !== false);
  const courier = tim[0] ?? null;
  // Semua kurir berbagi satu daftar tugas, jadi siapa pun yang masuk bisa
  // mengambil pesanan antar yang belum selesai.
  const semua = db.orders.filter((o) => o.metode === "antar");
  // Tugas aktif = pesanan yang sudah diserahkan admin. Kurir tidak perlu
  // menekan tombol konfirmasi apa pun.
  const mulaiAntar = (order: Order) =>
    db.deliveries.find((d) => d.orderId === order.id)?.mulai ?? "";
  const orders = semua
    .filter((o) => o.status === "diantar")
    .sort((a, b) => mulaiAntar(a).localeCompare(mulaiAntar(b)));
  const riwayat = semua
    .filter((o) => o.status === "selesai")
    .sort((a, b) => b.diperbarui.localeCompare(a.diperbarui))
    .slice(0, 8);
  return {
    courier: courier
      ? courierPublic(courier)
      : {
          id: "tim",
          nama: "Tim Kurir Yanti",
          telepon: "",
          kendaraan: "Tim pengantaran",
          status: "siap" as const,
          online: true,
          rating: 5,
          aktif: true,
        },
    orders,
    riwayat,
    items: db.orderItems,
    deliveries: db.deliveries,
    settings: db.settings,
  };
}

export interface CheckoutInput {
  nama: string;
  telepon: string;
  alamat: string;
  catatan: string;
  metode: "ambil" | "antar";
  pembayaran: PaymentMethod;
  jadwal: string;
  items: { id: string; jumlah: number }[];
}

export async function createOrder(input: CheckoutInput) {
  const db = await readDB();
  const nama = input.nama?.trim();
  const telepon = normalTelepon(input.telepon ?? "");
  const alamat = input.alamat?.trim() ?? "";

  if (!nama || nama.length < 2) throw new Error("Nama minimal 2 karakter.");
  if (telepon.length < 10 || telepon.length > 15)
    throw new Error("Nomor HP tidak valid.");
  if (input.metode === "antar" && alamat.length < 8)
    throw new Error("Alamat pengantaran wajib diisi minimal 8 karakter.");
  if (!["ambil", "antar"].includes(input.metode))
    throw new Error("Metode pengambilan tidak valid.");
  if (!["tunai", "qris", "transfer"].includes(input.pembayaran))
    throw new Error("Metode pembayaran tidak valid.");

  const tutup = !db.settings.tokoBuka;
  const jadwalTersedia = db.settings.jadwalKirim ?? [];
  const jadwalDiminta = input.jadwal?.trim() ?? "";

  if (tutup) {
    if (input.pembayaran !== "tunai")
      throw new Error(
        "Toko sedang tutup, pembayaran online belum bisa dilakukan. Pilih bayar tunai saat pesanan diserahkan.",
      );
    if (!jadwalDiminta || !jadwalTersedia.includes(jadwalDiminta))
      throw new Error(
        "Toko sedang tutup. Pilih salah satu jadwal kirim/ambil yang tersedia.",
      );
  } else if (jadwalDiminta && !jadwalTersedia.includes(jadwalDiminta)) {
    throw new Error("Jadwal yang dipilih tidak tersedia. Muat ulang halaman.");
  }

  const diminta = (input.items ?? []).filter(
    (i) => i && typeof i.id === "string" && Number.isFinite(i.jumlah),
  );
  if (!diminta.length) throw new Error("Keranjang masih kosong.");

  const items: OrderItem[] = [];
  const produkBerubah: Product[] = [];
  let subtotal = 0;
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  for (const [index, baris] of diminta.entries()) {
    const jumlah = Math.floor(baris.jumlah);
    if (jumlah < 1 || jumlah > 99) throw new Error("Jumlah produk tidak valid.");
    const produk = db.products.find((p) => p.id === baris.id && p.aktif);
    if (!produk) throw new Error("Ada produk yang sudah tidak tersedia.");
    if (produk.stok < jumlah)
      throw new Error(`Stok ${produk.nama} tersisa ${produk.stok}.`);
    const harga = produk.hargaPromo ?? produk.harga;
    subtotal += harga * jumlah;
    items.push({
      id: `OI-${Date.now().toString(36)}-${index}`,
      orderId,
      produkId: produk.id,
      nama: produk.nama,
      harga,
      jumlah,
      satuan: produk.satuan,
      gambar: produk.gambar,
    });
    produkBerubah.push({ ...produk, stok: produk.stok - jumlah });
  }

  const ongkir =
    input.metode === "ambil"
      ? 0
      : subtotal >= db.settings.gratisOngkirMin
        ? 0
        : db.settings.ongkir;

  const segar = await readDB();
  let kode = kodePesanan();
  for (let i = 0; i < 6 && segar.orders.some((o) => o.kode === kode); i++) {
    kode = kodePesanan();
  }

  const sekarang = new Date().toISOString();
  const jadwal = jadwalDiminta
    ? jadwalDiminta
    : input.metode === "ambil"
      ? "Hari ini, secepatnya"
      : `Estimasi ${db.settings.estimasiAntar} menit setelah dikonfirmasi`;

  const userLama = db.users.find((u) => normalTelepon(u.telepon) === telepon);
  const userId = userLama?.id ?? `USR-${Date.now().toString(36).toUpperCase()}`;
  const userBaru = {
    id: userId,
    nama,
    telepon,
    alamat: alamat || userLama?.alamat || "",
    dibuat: userLama?.dibuat ?? sekarang,
  };

  const order: Order = {
    id: orderId,
    kode,
    userId,
    pelanggan: nama,
    telepon,
    alamat,
    catatan: input.catatan?.trim() ?? "",
    metode: input.metode,
    pembayaran: input.pembayaran,
    dibayar: false,
    ongkir,
    subtotal,
    total: subtotal + ongkir,
    status: "baru",
    kurirId: "",
    jadwal,
    dibuat: sekarang,
    diperbarui: sekarang,
  };

  await saveRows("orders", [order]);
  await saveRows("orderItems", items);
  await saveRows("products", produkBerubah);
  await saveRows("users", [userBaru]);

  return { kode, order, items };
}

export async function updateOrder(
  kode: string,
  patch: { status?: OrderStatus; dibayar?: boolean; kurirId?: string; catatan?: string },
) {
  const db = await readDB();
  const order = db.orders.find((o) => o.kode === kode);
  if (!order) throw new Error("Pesanan tidak ditemukan.");

  const sekarang = new Date().toISOString();
  const lama = order.status;
  const baru: Order = { ...order, diperbarui: sekarang };
  // Hanya kolom yang benar-benar diubah yang ditulis, supaya klik admin dan
  // aksi kurir yang hampir bersamaan tidak saling menimpa.
  const kolomOrder = new Set<string>(["diperbarui"]);

  if (typeof patch.dibayar === "boolean") {
    baru.dibayar = patch.dibayar;
    kolomOrder.add("dibayar");
  }

  if (patch.kurirId !== undefined) {
    if (patch.kurirId) {
      const kurir = db.couriers.find((c) => c.id === patch.kurirId);
      if (!kurir) throw new Error("Kurir tidak ditemukan.");
      baru.kurirId = kurir.id;
    } else {
      baru.kurirId = "";
    }
    kolomOrder.add("kurirId");
  }

  let delivery = db.deliveries.find((d) => d.orderId === order.id) ?? null;
  const deliveryBaru = !delivery;

  if (patch.status) {
    if (
      !["baru", "dikonfirmasi", "disiapkan", "siap", "diantar", "selesai", "batal"].includes(
        patch.status,
      )
    )
      throw new Error("Status tidak valid.");
    baru.status = patch.status;
    kolomOrder.add("status");
  }

  // Pesanan antar yang sudah dikonfirmasi langsung masuk ke kurir yang siap,
  // supaya admin tidak perlu menugaskan dua kali.
  if (
    baru.metode === "antar" &&
    !baru.kurirId &&
    baru.status &&
    ["dikonfirmasi", "disiapkan", "siap", "diantar"].includes(baru.status)
  ) {
    const kurirSiap =
      db.couriers.find((c) => c.aktif !== false && c.status === "siap") ??
      db.couriers.find((c) => c.aktif !== false);
    if (kurirSiap) {
      baru.kurirId = kurirSiap.id;
      kolomOrder.add("kurirId");
    }
  }

  if (patch.status === "diantar" && baru.metode === "antar" && !baru.kurirId)
    throw new Error("Pilih kurir sebelum mengirim pesanan.");

  if (baru.metode === "antar" && baru.kurirId) {
    if (!delivery) {
      delivery = {
        id: `DLV-${order.id}`,
        orderId: order.id,
        kurirId: baru.kurirId,
        status: "ditugaskan",
        mulai: "",
        selesai: "",
        lat: null,
        lng: null,
        diperbarui: sekarang,
        estimasiMenit: db.settings.estimasiAntar,
      };
    } else {
      delivery = { ...delivery, kurirId: baru.kurirId };
    }
  }

  if (baru.status === "diantar") {
    if (!delivery) throw new Error("Tugaskan kurir terlebih dahulu.");
    delivery = {
      ...delivery,
      status: "aktif",
      mulai: delivery.mulai || sekarang,
      selesai: "",
      diperbarui: sekarang,
    };
  }

  // Pesanan antar ditutup kurir lewat foto bukti, bukan dari panel admin.
  if (patch.status === "selesai" && baru.metode === "antar")
    throw new Error(
      "Pesanan antar diselesaikan kurir dengan foto bukti. Pantau dari halaman kurir.",
    );

  if (baru.status === "selesai" && delivery) {
    delivery = {
      ...delivery,
      status: "selesai",
      mulai: delivery.mulai || sekarang,
      selesai: sekarang,
      diperbarui: sekarang,
    };
  }

  const perubahan: Parameters<typeof saveAll>[0] = {
    orders: { rows: [baru], fields: Array.from(kolomOrder) },
  };

  if (delivery) {
    perubahan.deliveries = deliveryBaru
      ? { rows: [delivery] }
      : {
          rows: [delivery],
          fields: ["kurirId", "status", "mulai", "selesai", "diperbarui"],
        };
  }

  if (baru.status === "batal" && lama !== "batal") {
    const items = db.orderItems.filter((i) => i.orderId === order.id);
    const produk = db.products.map((p) => {
      const it = items.find((i) => i.produkId === p.id);
      return it ? { ...p, stok: p.stok + it.jumlah } : p;
    });
    perubahan.products = { rows: produk, fields: ["stok"] };
  }

  // Status kurir ikut bergerak: mengantar saat admin menyerahkan pesanan,
  // kembali siap setelah pesanan selesai atau dibatalkan.
  if (baru.kurirId) {
    const barisKurir: Courier[] = [];
    const tambahKurir = (id: string, ubah: Partial<Courier>) => {
      if (!id || barisKurir.some((row) => row.id === id)) return;
      const kurir = db.couriers.find((c) => c.id === id);
      if (kurir) barisKurir.push({ ...kurir, ...ubah });
    };
    if (baru.status === "diantar") {
      tambahKurir(baru.kurirId, { status: "mengantar", online: true });
      if (order.kurirId && order.kurirId !== baru.kurirId)
        tambahKurir(order.kurirId, { status: "siap" });
    } else if (baru.status === "selesai" || baru.status === "batal") {
      tambahKurir(baru.kurirId, { status: "siap" });
    }
    if (barisKurir.length)
      perubahan.couriers = { rows: barisKurir, fields: ["status", "online"] };
  }

  // Satu permintaan untuk semua tabel: klik admin selesai jauh lebih cepat.
  await saveAll(perubahan);

  return { order: baru, delivery };
}

export async function verifyAdmin(
  sandi: string,
): Promise<{ nama: string; id?: string } | null> {
  const db = await readDB();
  for (const staff of db.staff) {
    if (staff.peran !== "admin" || staff.aktif === false) continue;
    if (staff.sandi && verifyPassword(sandi, staff.sandi))
      return { nama: staff.nama, id: staff.id };
  }
  const dariEnv = adminPassword();
  if (dariEnv && sameSecret(sandi, dariEnv)) return { nama: "Admin Yanti" };
  return null;
}

export async function verifyCourier(
  sandi: string,
): Promise<{ nama: string } | null> {
  if (!sandi) return null;
  const db = await readDB();
  for (const kurir of db.couriers) {
    if (kurir.aktif === false) continue;
    if (kurir.sandi && verifyPassword(sandi, kurir.sandi))
      return { nama: "Tim Kurir Yanti" };
  }
  const dariEnv = courierPassword();
  if (dariEnv && sameSecret(sandi, dariEnv))
    return { nama: "Tim Kurir Yanti" };
  return null;
}

function pilihTujuan(db: Awaited<ReturnType<typeof readDB>>, kode: string) {
  const order = db.orders.find(
    (o) => o.kode.toLowerCase() === kode.toLowerCase().trim(),
  );
  if (!order) throw new Error("Tugas tidak ditemukan.");
  return { order };
}

export async function courierFinish(kode: string) {
  const db = await readDB();
  const { order } = pilihTujuan(db, kode);
  if (order.status === "selesai")
    throw new Error("Pesanan ini sudah ditandai diterima.");
  if (order.status !== "diantar")
    throw new Error("Pesanan belum dalam pengantaran.");
  if (!(await buktiAda(order.id)))
    throw new Error("Ambil dan unggah foto bukti barang diterima dulu.");

  const sekarang = new Date().toISOString();
  const delivery = db.deliveries.find((d) => d.orderId === order.id);
  const kurir = db.couriers.find((c) => c.id === order.kurirId);

  await saveAll({
    orders: {
      rows: [{ ...order, status: "selesai", diperbarui: sekarang }],
      fields: ["status", "diperbarui"],
    },
    deliveries: delivery
      ? {
          rows: [
            {
              ...delivery,
              status: "selesai",
              selesai: sekarang,
              diperbarui: sekarang,
            },
          ],
          fields: ["status", "selesai", "diperbarui"],
        }
      : undefined,
    couriers: kurir
      ? { rows: [{ ...kurir, status: "siap" }], fields: ["status"] }
      : undefined,
  });
}

export async function courierLocation(
  lat: number,
  lng: number,
  kode?: string,
) {
  const db = await readDB();
  const order = kode
    ? db.orders.find(
        (o) =>
          o.kode.toLowerCase() === kode.toLowerCase().trim() &&
          o.status === "diantar",
      )
    : db.orders.find((o) => o.status === "diantar");
  if (!order) return;
  const delivery = db.deliveries.find((d) => d.orderId === order.id);
  if (!delivery) return;
  await saveAll({
    deliveries: {
      rows: [
        {
          ...delivery,
          lat,
          lng,
          diperbarui: new Date().toISOString(),
          status: "aktif",
        },
      ],
      fields: ["lat", "lng", "diperbarui", "status"],
    },
  });
}

export async function setCourierOnline(courierId: string, online: boolean) {
  const db = await readDB();
  const kurir = db.couriers.find((c) => c.id === courierId);
  if (!kurir) throw new Error("Kurir tidak ditemukan.");
  await saveRows("couriers", [
    { ...kurir, online, status: online ? kurir.status : "off" },
  ]);
}

export interface ProductInput {
  id?: string;
  nama: string;
  kategori: string;
  harga: number;
  hargaPromo: number | null;
  satuan: string;
  stok: number;
  deskripsi: string;
  gambar: string;
  unggulan: boolean;
  aktif: boolean;
}

export async function saveProduct(input: ProductInput) {
  const db = await readDB();
  const lama = input.id ? db.products.find((p) => p.id === input.id) : null;
  const nama = input.nama?.trim();
  if (!nama || nama.length < 2) throw new Error("Nama produk minimal 2 karakter.");
  const harga = Math.round(Number(input.harga));
  if (!Number.isFinite(harga) || harga <= 0) throw new Error("Harga tidak valid.");
  const stok = Math.floor(Number(input.stok));
  if (!Number.isFinite(stok) || stok < 0) throw new Error("Stok tidak valid.");
  const hargaPromo =
    input.hargaPromo && Number(input.hargaPromo) > 0
      ? Math.round(Number(input.hargaPromo))
      : null;
  if (hargaPromo && hargaPromo >= harga)
    throw new Error("Harga promo harus lebih murah dari harga normal.");

  let slug = slugify(nama);
  if (!slug) slug = `produk-${Date.now()}`;
  if (
    db.products.some((p) => p.slug === slug && p.id !== input.id)
  )
    slug = `${slug}-${Math.floor(Math.random() * 99)}`;

  const produk: Product = {
    id: lama?.id ?? `P${Date.now().toString(36).toUpperCase()}`,
    nama,
    slug,
    kategori: input.kategori?.trim() || "Lainnya",
    harga,
    hargaPromo,
    satuan: input.satuan?.trim() || "pcs",
    stok,
    deskripsi: input.deskripsi?.trim() ?? "",
    gambar: tautanGambar(input.gambar?.trim() || "/produk/nugget.jpg"),
    unggulan: Boolean(input.unggulan),
    aktif: input.aktif !== false,
    dibuat: lama?.dibuat ?? new Date().toISOString(),
  };
  await saveRows("products", [produk]);
  return produk;
}

export async function deleteProduct(id: string) {
  await removeRow("products", id);
}

export interface PromotionInput {
  id?: string;
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

export async function savePromotion(input: PromotionInput) {
  const db = await readDB();
  const lama = input.id ? db.promotions.find((p) => p.id === input.id) : null;
  if (!input.judul?.trim()) throw new Error("Judul promo wajib diisi.");
  const promo: Promotion = {
    id: lama?.id ?? `PR${Date.now().toString(36).toUpperCase()}`,
    tipe: input.tipe,
    judul: input.judul.trim(),
    deskripsi: input.deskripsi?.trim() ?? "",
    badge: input.badge?.trim() ?? "",
    gambar: tautanGambar(input.gambar?.trim() ?? ""),
    cta: input.cta?.trim() ?? "",
    aktif: input.aktif !== false,
    mulai: input.mulai || new Date().toISOString(),
    selesai: input.selesai || new Date(Date.now() + 30 * 86400000).toISOString(),
  };
  await saveRows("promotions", [promo]);
  return promo;
}

export async function deletePromotion(id: string) {
  await removeRow("promotions", id);
}

function rapikanJadwal(value: unknown, fallback: string[]): string[] {
  const daftar = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|;|\|/)
      : [];
  const bersih = daftar
    .map((s) => String(s).trim())
    .filter(Boolean)
    .slice(0, 20);
  return bersih.length ? Array.from(new Set(bersih)) : fallback;
}

export async function updateSettings(input: Settings) {
  const lama = (await readDB()).settings;
  const ongkir = Math.round(Number(input.ongkir));
  const gratis = Math.round(Number(input.gratisOngkirMin));
  const estimasi = Math.round(Number(input.estimasiAntar));
  const bank = rapikanBank(input.bank ?? lama.bank, lama.bank);
  const utama = bank[0];
  const settings: Settings = {
    ...input,
    namaToko: input.namaToko?.trim() || "Yanti Frozen",
    telepon: normalTelepon(input.telepon || "08980440095"),
    alamat: input.alamat?.trim() ?? "",
    jamBuka: input.jamBuka?.trim() ?? "",
    ongkir: Number.isFinite(ongkir) && ongkir >= 0 ? ongkir : 0,
    gratisOngkirMin: Number.isFinite(gratis) && gratis >= 0 ? gratis : 0,
    estimasiAntar: Number.isFinite(estimasi) && estimasi > 0 ? estimasi : 20,
    whatsappAdmin: normalTelepon(input.whatsappAdmin || "08980440095"),
    rekening: utama
      ? `${utama.bank} ${utama.nomor}`.trim()
      : (input.rekening?.trim() ?? ""),
    atasNama: utama ? utama.atasNama : (input.atasNama?.trim() ?? ""),
    qrisGambar: tautanGambar(input.qrisGambar?.trim() ?? lama.qrisGambar ?? ""),
    bank,
    tokoBuka: input.tokoBuka !== false,
    tutupCatatan:
      input.tutupCatatan?.trim() ||
      "Toko sedang tutup. Silakan pilih jadwal kirim/ambil yang tersedia.",
    jadwalKirim: rapikanJadwal(input.jadwalKirim, [
      "Hari ini 10.00–12.00",
      "Hari ini 14.00–16.00",
      "Besok 08.00–10.00",
    ]),
  };
  await saveSettings(settings);
  return settings;
}

export async function setStoreOpen(buka: boolean) {
  const db = await readDB();
  const settings: Settings = { ...db.settings, tokoBuka: buka };
  await saveSettings(settings);
  return settings;
}

export async function getDeveloperData() {
  const db = await readDB();
  return {
    staff: db.staff.map(staffPublic),
    couriers: db.couriers.map(courierPublic),
    bugs: [...db.bugs].sort((a, b) => b.dibuat.localeCompare(a.dibuat)),
    settings: db.settings,
  };
}

function periksaSandi(sandi: string, label = "Kata sandi") {
  if (sandi.length < 6)
    throw new Error(`${label} minimal 6 karakter.`);
  if (sandi.length > 100) throw new Error(`${label} terlalu panjang.`);
}

export async function saveStaffAccount(input: {
  id?: string;
  nama: string;
  telepon: string;
  sandi?: string;
  aktif?: boolean;
}) {
  const db = await readDB();
  const lama = input.id ? db.staff.find((s) => s.id === input.id) : null;
  if (input.id && !lama) throw new Error("Akun staff tidak ditemukan.");
  const nama = input.nama?.trim() ?? "";
  if (nama.length < 2) throw new Error("Nama staff minimal 2 karakter.");
  let sandi = lama?.sandi ?? "";
  if (!lama || input.sandi) {
    const baru = input.sandi ?? "";
    periksaSandi(baru);
    sandi = hashPassword(baru);
  }
  if (lama && input.aktif === false && lama.aktif !== false) {
    const aktif = db.staff.filter(
      (s) => s.peran === "admin" && s.aktif !== false && s.id !== lama.id,
    );
    if (aktif.length === 0)
      throw new Error("Minimal satu akun admin harus tetap aktif.");
  }
  const staff: Staff = {
    id: lama?.id ?? `ST${Date.now().toString(36).toUpperCase()}`,
    nama,
    peran: "admin",
    telepon: normalTelepon(input.telepon ?? ""),
    sandi,
    aktif: input.aktif ?? lama?.aktif ?? true,
    dibuat: lama?.dibuat ?? new Date().toISOString(),
  };
  await saveRows("staff", [staff]);
  return staffPublic(staff);
}

export async function deleteStaffAccount(id: string) {
  const db = await readDB();
  const staff = db.staff.find((s) => s.id === id);
  if (!staff) throw new Error("Akun staff tidak ditemukan.");
  const adminLain = db.staff.filter(
    (s) => s.peran === "admin" && s.aktif !== false && s.id !== id,
  );
  if (staff.peran === "admin" && staff.aktif !== false && adminLain.length === 0)
    throw new Error("Minimal satu akun admin harus tetap aktif.");
  await removeRow("staff", id);
}

export async function saveCourierAccount(input: {
  id?: string;
  nama: string;
  telepon: string;
  kendaraan: string;
  sandi?: string;
  aktif?: boolean;
}) {
  const db = await readDB();
  const lama = input.id ? db.couriers.find((c) => c.id === input.id) : null;
  if (input.id && !lama) throw new Error("Akun kurir tidak ditemukan.");
  const nama = input.nama?.trim() ?? "";
  if (nama.length < 2) throw new Error("Nama kurir minimal 2 karakter.");
  const telepon = normalTelepon(input.telepon ?? "");
  if (telepon && (telepon.length < 10 || telepon.length > 15))
    throw new Error("Nomor HP kurir tidak valid.");
  if (telepon && telepon !== lama?.telepon && db.couriers.some((c) => c.telepon === telepon))
    throw new Error("Nomor HP itu sudah dipakai kurir lain.");
  let sandi = lama?.sandi ?? "";
  if (!lama || input.sandi) {
    periksaSandi(input.sandi ?? "", "Sandi kurir");
    sandi = hashPassword(input.sandi ?? "");
  }
  const kurir: Courier = {
    id: lama?.id ?? `K${Date.now().toString(36).toUpperCase()}`,
    nama,
    telepon,
    sandi,
    kendaraan: input.kendaraan?.trim() ?? "",
    status: lama?.status ?? "siap",
    online: lama?.online ?? false,
    rating: lama?.rating ?? 0,
    aktif: input.aktif ?? lama?.aktif ?? true,
  };
  await saveRows("couriers", [kurir]);
  return courierPublic(kurir);
}

export async function deleteCourierAccount(id: string) {
  const db = await readDB();
  const dipakai = db.orders.some(
    (o) => o.kurirId === id && !["selesai", "batal"].includes(o.status),
  );
  if (dipakai) throw new Error("Kurir masih punya tugas aktif. Nonaktifkan saja.");
  await removeRow("couriers", id);
}

export async function catatBug(input: {
  pesan: string;
  halaman?: string;
  peran?: string;
}) {
  const pesan = input.pesan?.trim().slice(0, 800) ?? "";
  if (pesan.length < 5) throw new Error("Laporan bug terlalu pendek.");
  const sekarang = new Date().toISOString();
  const bug: Bug = {
    id: `BG${Date.now().toString(36).toUpperCase()}`,
    pesan,
    halaman: (input.halaman ?? "").trim().slice(0, 240),
    peran: (input.peran ?? "").trim().slice(0, 40),
    status: "baru",
    dibuat: sekarang,
    diperbarui: sekarang,
  };
  await saveRows("bugs", [bug]);
  return bug;
}

export async function ubahStatusBug(id: string, status: BugStatus) {
  if (!["baru", "diproses", "selesai"].includes(status))
    throw new Error("Status bug tidak valid.");
  const db = await readDB();
  const bug = db.bugs.find((b) => b.id === id);
  if (!bug) throw new Error("Laporan bug tidak ditemukan.");
  const baru: Bug = { ...bug, status, diperbarui: new Date().toISOString() };
  await saveRows("bugs", [baru]);
  return baru;
}

export async function hapusBug(id: string) {
  await removeRow("bugs", id);
}
