import { randomBytes } from "crypto";
import { hashPassword } from "./password";
import type { DB, Product, Settings } from "./types";

// Tanpa env, akun awal memakai kata sandi acak yang tidak dapat ditebak;
// login tetap berjalan lewat ADMIN_PASSWORD/COURIER_PASSWORD di server.
function sandiAwal(env: "ADMIN_PASSWORD" | "COURIER_PASSWORD") {
  return hashPassword(
    process.env[env]?.trim() || randomBytes(24).toString("base64url"),
  );
}

export function createDefaultSettings(): Settings {
  return {
    namaToko: "Jayanti Frozen",
    telepon: "628980440095",
    alamat: "Jl. Melati No. 12, Klojen, Malang",
    jamBuka: "08.00 – 21.00",
    ongkir: 12000,
    gratisOngkirMin: 150000,
    rekening: "BCA 1234 5678 90",
    atasNama: "Jayanti Frozen",
    qrisNama: "Jayanti Frozen",
    estimasiAntar: 20,
    whatsappAdmin: "628980440095",
    tokoBuka: true,
    tutupCatatan:
      "Toko sedang tutup. Silakan pilih jadwal kirim/ambil yang tersedia.",
    jadwalKirim: [
      "Hari ini 10.00–12.00",
      "Hari ini 14.00–16.00",
      "Besok 08.00–10.00",
    ],
  };
}

/** Data awal untuk toko sungguhan: tanpa produk/order contoh. */
export function createBootstrap(): DB {
  const dasar = createSeed();
  return {
    users: [],
    products: [],
    orders: [],
    orderItems: [],
    couriers: [
      {
        id: "K01",
        nama: "Kurir Jayanti",
        telepon: "",
        sandi: sandiAwal("COURIER_PASSWORD"),
        kendaraan: "Tim pengantaran",
        status: "siap",
        online: true,
        rating: 5,
        aktif: true,
      },
    ],
    deliveries: [],
    promotions: [],
    staff: dasar.staff,
    bugs: [],
    settings: createDefaultSettings(),
  };
}

const hariIni = new Date();
const iso = (msLalu: number) => new Date(hariIni.getTime() - msLalu).toISOString();
const menit = 60_000;
const jam = 60 * menit;
const hari = 24 * jam;

function produk(
  id: string,
  nama: string,
  slug: string,
  kategori: string,
  harga: number,
  satuan: string,
  stok: number,
  gambar: string,
  deskripsi: string,
  unggulan = false,
  hargaPromo: number | null = null,
): Product {
  return {
    id,
    nama,
    slug,
    kategori,
    harga,
    hargaPromo,
    satuan,
    stok,
    deskripsi,
    gambar,
    unggulan,
    aktif: true,
    dibuat: iso(60 * hari),
  };
}

export function createSeed(): DB {
  const products: Product[] = [
    produk(
      "P01", "Chicken Nugget", "chicken-nugget", "Nugget & Sosis", 32000, "500 g", 42,
      "/produk/nugget.jpg",
      "Nugget ayam premium dengan daging dada ayam asli. Renyah di luar, lembut di dalam. Cukup goreng 3 menit, cocok untuk lauk atau bekal anak.",
      true, 27900,
    ),
    produk(
      "P02", "Sosis Sapi", "sosis-sapi", "Nugget & Sosis", 28000, "500 g", 30,
      "/produk/sosis.jpg",
      "Sosis sapi tanpa pengawet tambahan, rasa gurih dan padat. Bisa digoreng, dibakar, atau dijadikan isian roti dan nasi goreng.",
      true,
    ),
    produk(
      "P03", "Bakso Sapi", "bakso-sapi", "Bakso", 30000, "500 g", 26,
      "/produk/bakso.jpg",
      "Bakso sapi halus dengan tekstur kenyal. Praktis untuk kuah bakso, tumis, atau camilan anak di rumah.",
      true,
    ),
    produk(
      "P04", "Kentang Goreng", "kentang-goreng", "Kentang", 40000, "1 kg", 34,
      "/produk/kentang.jpg",
      "Shoestring potato beku siap goreng. Hasilnya renyah di luar dan lembut di dalam, cocok untuk camilan keluarga.",
      true, 34900,
    ),
    produk(
      "P05", "Fillet Dada Ayam", "fillet-dada-ayam", "Ayam", 38000, "500 g", 18,
      "/produk/ayam.jpg",
      "Fillet dada ayam tanpa tulang, sudah dibersihkan dan dipotong rapi. Siap dimasak untuk ayam krispi, sop, atau tumisan.",
    ),
    produk(
      "P06", "Udang Kupas", "udang-kupas", "Seafood", 55000, "500 g", 12,
      "/produk/udang.jpg",
      "Udang putih kupas segar tanpa kepala, dibekukan cepat untuk menjaga rasa manis alami. Cocok untuk bakwan, tumis, dan sup.",
    ),
    produk(
      "P07", "Beef Slice", "beef-slice", "Daging", 62000, "500 g", 9,
      "/produk/beef-slice.jpg",
      "Irisan daging sapi tipis untuk shabu-shabu, yakiniku, atau tumis cepat. Tekstur lembut dengan marbling yang pas.",
    ),
    produk(
      "P08", "Lumpia Ayam", "lumpia-ayam", "Camilan", 25000, "10 pcs", 35,
      "/produk/lumpia.jpg",
      "Lumpia ayam beku siap goreng dengan isian ayam dan sayur yang padat. Renyah dan tidak berminyak.",
    ),
    produk(
      "P09", "Spicy Chicken Nugget", "spicy-chicken-nugget", "Nugget & Sosis", 34000, "500 g", 22,
      "/produk/nugget.jpg",
      "Nugget ayam dengan balutan bumbu pedas gurih. Pedasnya pas, cocok untuk yang suka sensasi berbeda.",
    ),
    produk(
      "P10", "Sosis Ayam", "sosis-ayam", "Nugget & Sosis", 26000, "500 g", 28,
      "/produk/sosis.jpg",
      "Sosis ayam lembut dengan rasa ringan, favorit anak-anak. Aman dijadikan bekal sekolah.",
    ),
    produk(
      "P11", "Bakso Ikan", "bakso-ikan", "Bakso", 32000, "500 g", 0,
      "/produk/bakso.jpg",
      "Bakso ikan tenggiri asli dengan tekstur kenyal dan rasa laut yang segar. Segera hadir kembali.",
    ),
    produk(
      "P12", "Kentang Wedges", "kentang-wedges", "Kentang", 45000, "1 kg", 16,
      "/produk/kentang.jpg",
      "Kentang wedges dengan potongan tebal dan bumbu rempah. Cukup oven atau air fryer, renyah tanpa banyak minyak.",
    ),
  ];

  const total = (items: { harga: number; jumlah: number }[]) =>
    items.reduce((a, b) => a + b.harga * b.jumlah, 0);

  const d1Items = [
    { harga: 27900, jumlah: 2 },
    { harga: 34900, jumlah: 1 },
  ];
  const d2Items = [{ harga: 28000, jumlah: 2 }];
  const d3Items = [
    { harga: 55000, jumlah: 1 },
    { harga: 30000, jumlah: 2 },
  ];
  const d4Items = [{ harga: 62000, jumlah: 1 }];

  return {
    users: [
      {
        id: "U01",
        nama: "Rina Kartika",
        telepon: "6281234567001",
        alamat: "Jl. Soekarno Hatta No. 45, Lowokwaru, Malang",
        dibuat: iso(40 * hari),
      },
      {
        id: "U02",
        nama: "Dedi Susanto",
        telepon: "6281234567002",
        alamat: "Jl. Ijen No. 88, Klojen, Malang",
        dibuat: iso(32 * hari),
      },
    ],
    products,
    orders: [
      {
        id: "DEMO1",
        kode: "JY-DEMO-001",
        userId: "U01",
        pelanggan: "Rina Kartika",
        telepon: "6281234567001",
        alamat: "Jl. Soekarno Hatta No. 45, Lowokwaru, Malang",
        catatan: "Tolong pisahkan kantong yang beku ya.",
        metode: "antar",
        pembayaran: "qris",
        dibayar: true,
        ongkir: 12000,
        subtotal: total(d1Items),
        total: total(d1Items) + 12000,
        status: "diantar",
        kurirId: "K01",
        jadwal: "Hari ini, 14.30",
        dibuat: iso(26 * menit),
        diperbarui: iso(5 * menit),
      },
      {
        id: "DEMO2",
        kode: "JY-DEMO-002",
        userId: "U02",
        pelanggan: "Dedi Susanto",
        telepon: "6281234567002",
        alamat: "",
        catatan: "",
        metode: "ambil",
        pembayaran: "tunai",
        dibayar: true,
        ongkir: 0,
        subtotal: total(d2Items),
        total: total(d2Items),
        status: "selesai",
        kurirId: "",
        jadwal: "Kemarin, 10.00",
        dibuat: iso(1 * hari + 3 * jam),
        diperbarui: iso(1 * hari),
      },
      {
        id: "DEMO3",
        kode: "JY-DEMO-003",
        userId: "U01",
        pelanggan: "Rina Kartika",
        telepon: "6281234567001",
        alamat: "Jl. Soekarno Hatta No. 45, Lowokwaru, Malang",
        catatan: "",
        metode: "antar",
        pembayaran: "transfer",
        dibayar: true,
        ongkir: 12000,
        subtotal: total(d3Items),
        total: total(d3Items) + 12000,
        status: "selesai",
        kurirId: "K02",
        jadwal: "3 hari lalu, 16.00",
        dibuat: iso(3 * hari + 2 * jam),
        diperbarui: iso(3 * hari),
      },
      {
        id: "DEMO4",
        kode: "JY-DEMO-004",
        userId: "U02",
        pelanggan: "Dedi Susanto",
        telepon: "6281234567002",
        alamat: "",
        catatan: "Ambil sore sekitar jam 17.00.",
        metode: "ambil",
        pembayaran: "transfer",
        dibayar: false,
        ongkir: 0,
        subtotal: total(d4Items),
        total: total(d4Items),
        status: "baru",
        kurirId: "",
        jadwal: "Hari ini, 17.00",
        dibuat: iso(18 * menit),
        diperbarui: iso(18 * menit),
      },
    ],
    orderItems: [
      {
        id: "OI1", orderId: "DEMO1", produkId: "P01", nama: "Chicken Nugget",
        harga: 27900, jumlah: 2, satuan: "500 g", gambar: "/produk/nugget.jpg",
      },
      {
        id: "OI2", orderId: "DEMO1", produkId: "P04", nama: "Kentang Goreng",
        harga: 34900, jumlah: 1, satuan: "1 kg", gambar: "/produk/kentang.jpg",
      },
      {
        id: "OI3", orderId: "DEMO2", produkId: "P02", nama: "Sosis Sapi",
        harga: 28000, jumlah: 2, satuan: "500 g", gambar: "/produk/sosis.jpg",
      },
      {
        id: "OI4", orderId: "DEMO3", produkId: "P06", nama: "Udang Kupas",
        harga: 55000, jumlah: 1, satuan: "500 g", gambar: "/produk/udang.jpg",
      },
      {
        id: "OI5", orderId: "DEMO3", produkId: "P03", nama: "Bakso Sapi",
        harga: 30000, jumlah: 2, satuan: "500 g", gambar: "/produk/bakso.jpg",
      },
      {
        id: "OI6", orderId: "DEMO4", produkId: "P07", nama: "Beef Slice",
        harga: 62000, jumlah: 1, satuan: "500 g", gambar: "/produk/beef-slice.jpg",
      },
    ],
    couriers: [
      {
        id: "K01", nama: "Ahmad Fauzi", telepon: "6281234567801", sandi: sandiAwal("COURIER_PASSWORD"),
        kendaraan: "Honda Vario · N 1234 AB", status: "mengantar", online: true,
        rating: 4.9, aktif: true,
      },
      {
        id: "K02", nama: "Bagas Pratama", telepon: "6281234567802", sandi: sandiAwal("COURIER_PASSWORD"),
        kendaraan: "Yamaha NMAX · N 8891 C", status: "siap", online: true,
        rating: 4.8, aktif: true,
      },
    ],
    deliveries: [
      {
        id: "D1", orderId: "DEMO1", kurirId: "K01", status: "aktif",
        mulai: iso(5 * menit), selesai: "", lat: -7.9666, lng: 112.6326,
        diperbarui: iso(15_000), estimasiMenit: 20,
      },
      {
        id: "D2", orderId: "DEMO3", kurirId: "K02", status: "selesai",
        mulai: iso(3 * hari + 90 * menit), selesai: iso(3 * hari + 20 * menit),
        lat: null, lng: null, diperbarui: iso(3 * hari), estimasiMenit: 20,
      },
    ],
    promotions: [
      {
        id: "PR01", tipe: "banner", judul: "Promo Spesial!",
        deskripsi: "Diskon hingga 30% untuk paket frozen food pilihan. Stok terbatas, hanya minggu ini.",
        badge: "HEMAT 30%", gambar: "/brand/hero-promo.jpg", cta: "/katalog",
        aktif: true, mulai: iso(2 * hari), selesai: iso(-14 * hari),
      },
      {
        id: "PR02", tipe: "pengumuman", judul: "Gratis ongkir",
        deskripsi: "Belanja minimal Rp 150.000 gratis ongkir area Kota Malang.",
        badge: "INFO", gambar: "", cta: "",
        aktif: true, mulai: iso(2 * hari), selesai: iso(-30 * hari),
      },
    ],
    staff: [
      {
        id: "ST01",
        nama: "Admin Jayanti",
        peran: "admin",
        telepon: "",
        sandi: sandiAwal("ADMIN_PASSWORD"),
        aktif: true,
        dibuat: iso(60 * hari),
      },
    ],
    bugs: [],
    settings: createDefaultSettings(),
  };
}
