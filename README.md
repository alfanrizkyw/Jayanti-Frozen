# Yanti Frozen

Toko frozen food online: katalog, keranjang, checkout, pembayaran, pengambilan
di toko atau pengantaran kurir, pelacakan kurir langsung, dashboard admin,
halaman kurir, dan panel developer — semuanya responsif dan mudah dipakai
semua usia.

_Tagline: Fresh choice, frozen happiness. Segar, Praktis, & Lezat._

## Fitur

**Pembeli (tanpa akun)**

- Beranda dengan promo, pengumuman, kategori, dan produk unggulan.
- Katalog dengan pencarian, filter kategori, serta harga & stok terkini.
- Detail produk, keranjang, lalu checkout tanpa daftar atau kata sandi.
- Tombol tambah langsung menampilkan pengatur jumlah dan bilah keranjang mini,
  tanpa perlu membuka keranjang.
- Ambil di toko (pilih jadwal) atau antar kurir (alamat + ongkir otomatis).
- Pembayaran tunai, QRIS, atau transfer bank.
- Saat toko ditutup, checkout menampilkan keterangan jelas: pembayaran online
  belum tersedia dan pesanan dijadwalkan pada slot kirim/ambil yang dipilih.
- Halaman lacak pesanan: status berjalan, peta rute kurir, dan kontak kurir.
- Simpan kode pesanan untuk membuka pelacakan kembali kapan saja.

**Admin** — `/admin/masuk`

- Ringkasan penjualan, pesanan terbaru, stok menipis, dan daftar kurir.
- Notifikasi WhatsApp otomatis setiap ada pesanan baru, berisi ringkasan dan
  tautan langsung ke halaman konfirmasi pesanan.
- Verifikasi pembayaran lalu konfirmasi pesanan. Pesanan antar yang
  dikonfirmasi langsung ditugaskan ke kurir yang siap.
- Kelola produk (harga, promo, stok, deskripsi, foto), promo/banner, dan
  pengaturan toko.
- Buka/tutup toko satu klik dari dashboard, ubah alamat, jam buka, catatan
  saat tutup, serta slot jadwal kirim/ambil.
- Laporan penjualan 7/30/90 hari + ekspor CSV.

**Kurir** — `/kurir/masuk`

- Masuk hanya dengan kata sandi tim kurir — tanpa nomor HP atau nama pengguna.
- Semua tugas antar tampil untuk tim, lengkap dengan data pelanggan, isi
  pesanan, dan tagihan tunai.
- Tombol mulai antar, GPS live (dibagikan selama pengantaran), navigasi Google Maps.
- Menyelesaikan pengantaran; tugas pindah ke riwayat.

**Developer** — `/developer/masuk`

- Dasbor kesehatan layanan: mode penyimpanan, status Google Sheets, dan status
  notifikasi WhatsApp.
- Manajemen akun staff admin dan akun kurir: tambah, ubah kata sandi,
  aktif/nonaktifkan, dan hapus.
- Manajemen bug/error: laporan otomatis dari browser (error & promise gagal)
  serta daftar laporan dengan status baru/diproses/selesai.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Di mesin lokal, aplikasi memakai `.data/db.json`
dan mengisi data contoh otomatis. Di produksi, data contoh tidak pernah dibuat:
tanpa Google Sheets aplikasi berhenti dengan pesan konfigurasi yang jelas.

**Halaman masuk staff**

| Peran     | URL                | Kredensial                                    |
| --------- | ------------------ | --------------------------------------------- |
| Admin     | `/admin/masuk`     | kata sandi admin (`ADMIN_PASSWORD`)           |
| Kurir     | `/kurir/masuk`     | kata sandi tim kurir (`COURIER_PASSWORD`)     |
| Developer | `/developer/masuk` | kata sandi developer (`DEVELOPER_PASSWORD`)   |

Kata sandi default hanya tersimpan di sisi server (`lib/auth.ts`) dan dipakai
bila environment variable terkait kosong. Segera isi environment variable
sebelum produksi.

Untuk mengulang data contoh lokal, hapus `.data/db.json` lalu muat ulang
halaman. Set `SEED_DEMO=false` bila ingin mulai dari data kosong.

## Notifikasi WhatsApp

Saat pesanan baru dibuat, server mengirim pesan rapi ke nomor admin berisi kode
pesanan, data penerima, total, metode bayar, metode terima, daftar produk,
catatan, dan tautan `NEXT_PUBLIC_SITE_URL/admin/pesanan/<kode>` untuk langsung
mengonfirmasi pesanan dan pembayaran.

Pilih salah satu penyedia:

| Variabel                                      | Penyedia                  |
| --------------------------------------------- | ------------------------- |
| `FONNTE_TOKEN`                                | Fonnte (device token)     |
| `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Cloud API Meta   |

`WHATSAPP_ADMIN` mengatur nomor tujuan (format `62…`). Bila tidak ada token,
pesan dilewati dan alasannya dicatat di log server — pesanan tetap tersimpan
normal.

## Mode data

| Mode            | Syarat                                    | Penyimpanan                          |
| --------------- | ----------------------------------------- | ------------------------------------ |
| Lokal (dev)     | `GOOGLE_SHEETS_URL` kosong                | `.data/db.json`                      |
| Google Sheets   | `GOOGLE_SHEETS_URL` + `GOOGLE_SHEETS_KEY` | Spreadsheet via Apps Script          |

Produksi **hanya** memakai Google Sheets. Di Vercel tanpa `GOOGLE_SHEETS_URL`
dan `GOOGLE_SHEETS_KEY`, aplikasi menolak melayani data dan menampilkan pesan
agar kedua variabel diisi lalu redeploy — tidak ada fallback ke berkas lokal
atau `/tmp`, dan tidak ada data demo yang dibuat otomatis.

## Menghubungkan Google Sheets

Spreadsheet yang dipakai: `1bBqUXFwxlqM3bSh4RxwkzW97AOO7fIyWXfo7-i6Djos`
(sudah terpasang di `apps-script/Code.gs`).

1. Buka spreadsheet tersebut, lalu **Extensions → Apps Script**.
2. Hapus isi editor, tempel seluruh isi [`apps-script/Code.gs`](apps-script/Code.gs).
3. Di bagian atas file, sesuaikan:
   - `KUNCI` → kalimat acak panjang (ini menjadi `GOOGLE_SHEETS_KEY`).
   - `ID_SPREADSHEET` → ID spreadsheet bila memakai file lain.
4. Simpan, pilih fungsi `setup`, lalu **Run** sekali. Izinkan akses saat diminta.
   Semua tab berikut terbentuk otomatis: **Users, Products, Orders, OrderItems,
   Couriers, Deliveries, Promotions, Settings, Staff, Bugs**.
5. **Deploy → New deployment → Web app**:
   - _Execute as_: **Me**
   - _Who has access_: **Anyone**
6. Salin URL yang berakhiran `/exec`, lalu isi di hosting:
   `GOOGLE_SHEETS_URL=<url exec>` dan `GOOGLE_SHEETS_KEY=<KUNCI>`.
7. Buka toko sekali. Tab dibuat otomatis; produk, promo, dan stok diisi dari
   dashboard admin. Data contoh hanya dibuat saat pengembangan lokal.

Menjalankan `setup` ulang aman: header kolom yang berubah (misalnya `pin`
menjadi `sandi`) diperbarui tanpa menghapus baris data.

API Sheets hanya memakai **GET** (`action=read|upsert|delete|settings`) karena
Web App Apps Script mengalihkan POST dan membuang body permintaan. Penulisan
dilindungi `LockService`, dan teks dari pengguna diamankan dari eksekusi formula.

## Deploy ke Vercel

1. Impor repositori ini di Vercel (framework terdeteksi otomatis: Next.js).
2. Tambahkan environment variables:

   | Variabel                   | Wajib | Keterangan                                          |
   | -------------------------- | ----- | --------------------------------------------------- |
   | `AUTH_SECRET`              | ya    | Kalimat acak panjang untuk menandatangani sesi.     |
   | `ADMIN_PASSWORD`           | ya    | Kata sandi admin.                                   |
   | `COURIER_PASSWORD`         | ya    | Kata sandi kurir.                                   |
   | `DEVELOPER_PASSWORD`       | ya    | Kata sandi panel developer.                         |
   | `GOOGLE_SHEETS_URL`        | ya*   | URL `/exec` Apps Script.                            |
   | `GOOGLE_SHEETS_KEY`        | ya*   | Sama dengan `KUNCI` di `Code.gs`.                   |
   | `BLOB_READ_WRITE_TOKEN`    | ya*   | Token Vercel Blob untuk unggah foto produk/promo.   |
   | `NEXT_PUBLIC_SITE_URL`     | tidak | URL produksi untuk metadata/OG dan tautan WhatsApp. |
   | `WHATSAPP_ADMIN`           | tidak | Nomor admin tujuan notifikasi (`62…`).              |
   | `FONNTE_TOKEN`             | tidak | Token device Fonnte.                                |
   | `WHATSAPP_TOKEN`           | tidak | Token WhatsApp Cloud API.                           |
   | `WHATSAPP_PHONE_NUMBER_ID` | tidak | Phone number ID Cloud API.                          |
   | `GOOGLE_SPREADSHEET_ID`    | tidak | ID spreadsheet untuk tautan di panel developer.     |

   \* Wajib untuk produksi. Tanpa Blob, unggah foto ditolak; tanpa Sheets,
   aplikasi menampilkan pesan konfigurasi dan tidak memakai penyimpanan lokal.

3. Buat **Blob Store** di tab Storage Vercel lalu hubungkan ke project — token
   `BLOB_READ_WRITE_TOKEN` terisi otomatis.
4. Deploy. Setelah live, masuk admin → **Produk & stok** → unggah foto untuk
   memastikan Blob berjalan, lalu buat pesanan uji untuk memastikan notifikasi
   WhatsApp masuk.

## Unggah gambar

Foto dipotong otomatis dengan rasio tetap melalui cropper di browser, lalu
diproses ulang di server dengan `sharp`:

- Produk: **4:3**, 900 × 675 piksel.
- Banner promosi: **16:9**, 1600 × 900 piksel.

Format yang diterima JPG/PNG/WEBP maksimal 8 MB. Tanpa Blob di lokal, file
disimpan di `public/uploads` (tidak ikut git).

## Alur status pesanan

```
baru → dikonfirmasi → disiapkan → siap → diantar → selesai
                                  ↘ (ambil di toko) → selesai
batal (stok dikembalikan otomatis)
```

- **Ambil**: `disiapkan → siap` lalu `selesai` saat pelanggan mengambil.
- **Antar**: saat admin mengonfirmasi, pesanan otomatis ditugaskan ke kurir
  yang berstatus siap dan tugas antar dibuat. Status `diantar` dimulai
  admin/kurir, lalu kurir menekan **Pesanan sudah diantar**.
- Pembatalan mengembalikan stok produk terkait.

## Struktur singkat

```
app/
  (toko)/        Beranda, katalog, produk, keranjang, checkout, lacak
  (masuk)/       Halaman masuk admin, kurir, dan developer
  admin/         Ringkasan, pesanan, produk, promo, laporan, pengaturan
  kurir/         Halaman tugas kurir
  developer/     Panel bug/error dan akun staff
  api/           Auth, orders, admin, kurir, developer, bugs, upload
components/      UI toko, admin, kurir, developer, cropper, peta rute
lib/             seed, store (lokal/Sheets), auth, password, notify, format, tipe
apps-script/     Code.gs untuk backend Google Sheets
```

## Perintah

```bash
npm run dev      # server pengembangan :3000
npm run build    # build produksi
npm run start    # jalankan hasil build
npx tsc --noEmit # cek tipe
```

## Catatan keamanan

- Isi `ADMIN_PASSWORD`, `COURIER_PASSWORD`, `DEVELOPER_PASSWORD`, dan
  `AUTH_SECRET` sebelum live. Nilai default hanya untuk pengembangan lokal.
- Kata sandi staff dan kurir disimpan sebagai hash `scrypt` dengan salt; data
  yang dikirim ke browser tidak pernah memuat hash atau kata sandi.
- Sesi disimpan di cookie `httpOnly` bertanda tangan HMAC, berlaku 30 hari.
- Halaman admin, kurir, dan developer diperiksa di server; API memakai guard
  peran. Login dibatasi 8 percobaan gagal per 5 menit per IP + peran.
- `GOOGLE_SHEETS_KEY` adalah rahasia — jangan dimasukkan ke kode klien.
- Laporan bug dari pengunjung dibatasi agar tidak membanjiri panel developer.
- Data pelanggan hanya dipakai untuk memproses pesanan.
