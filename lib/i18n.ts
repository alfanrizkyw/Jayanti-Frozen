export type Lang = "id" | "en";
export type Theme = "light" | "dark";

export const ATURAN_ATRIBUT = [
  "placeholder",
  "aria-label",
  "title",
  "alt",
] as const;

const KAMUS: Record<string, string> = {
  // Navigasi & umum
  Beranda: "Home",
  Katalog: "Catalog",
  "Katalog produk": "Product catalog",
  "Lacak pesanan": "Track order",
  Lokasi: "Location",
  Lacak: "Track",
  Riwayat: "History",
  "Riwayat pesanan": "Order history",
  "Riwayat pesanan Anda": "Your order history",
  "Pesanan yang masih berjalan bisa dilacak, pesanan lama bisa dibuka rinciannya.":
    "Ongoing orders can be tracked, and past orders can be opened for details.",
  "Cari pesanan lain": "Find another order",
  "Punya kode pesanan dari perangkat lain? Masukkan kodenya di sini.":
    "Have an order code from another device? Enter it here.",
  "Kode pesanan tersimpan otomatis di HP ini selama data browser tidak dihapus.":
    "Order codes are saved automatically on this phone as long as browser data isn't cleared.",
  "Memuat riwayat pesanan…": "Loading order history…",
  "Belum ada pesanan di perangkat ini": "No orders on this device yet",
  "Pesanan yang Anda buat lewat HP ini akan tersimpan di sini.":
    "Orders you place from this phone will be saved here.",
  "Setelah Anda pesan dari HP ini, pesanan dan status kurirnya muncul otomatis di sini.":
    "After you order from this phone, the order and courier status appear here automatically.",
  "Riwayat belum bisa dimuat. Periksa koneksi lalu coba lagi.":
    "The history couldn't be loaded. Check your connection and try again.",
  "Buka katalog": "Open catalog",
  "Sedang berjalan": "In progress",
  "Sudah selesai": "Completed",
  "Status dan posisi kurir ikut diperbarui otomatis.":
    "Status and courier position update automatically.",
  "Lihat rincian": "View details",
  Diperbarui: "Updated",
  "Kurir sedang mengantar.": "The courier is on the way.",
  "Pesanan sudah siap diambil di toko.": "The order is ready for pickup.",
  "Status diperbarui otomatis oleh admin.":
    "The status is updated automatically by the admin.",
  "Pesanan yang masih berjalan muncul otomatis dari nomor HP yang Anda pakai saat pesan. Pesanan lama bisa dibuka rinciannya.":
    "Ongoing orders appear automatically from the phone number you used when ordering. Past orders can be opened for details.",
  "Nomor HP saat pesan": "Phone number used to order",
  "Nomor HP tidak valid. Contoh: 0898 0440 095.":
    "Invalid phone number. Example: 0898 0440 095.",
  "Lihat pesanan": "View orders",
  "Memeriksa pesanan…": "Checking orders…",
  "Tidak ada pesanan aktif": "No active orders",
  "Masukkan nomor HP yang Anda pakai saat pesan. Pesanan yang masih berjalan muncul otomatis tanpa kode.":
    "Enter the phone number you used to order. Ongoing orders appear automatically without a code.",
  "Ganti nomor": "Change number",
  Tutup: "Close",
  "Nomor HP": "Phone number",
  "Hapus nomor dari perangkat ini": "Remove this number from the device",
  "Cek pesanan dari nomor HP lain": "Check orders from another phone number",
  "Punya kode pesanan?": "Have an order code?",
  "Masukkan kode dari struk atau pesan WhatsApp toko.":
    "Enter the code from the receipt or the store's WhatsApp message.",
  "Cari kode": "Find code",
  "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.":
    "Too many attempts. Wait a few minutes and try again.",
  "Pesanan dari perangkat ini terbaca otomatis. Tidak perlu kode atau mengetik apa pun. Pesanan lama bisa dibuka rinciannya.":
    "Orders from this device are read automatically. No code or typing needed. Past orders can be opened for details.",
  "Data pesanan hanya tersimpan di perangkat ini, tidak dibagikan ke perangkat lain.":
    "Order data stays on this device and isn't shared with other devices.",
  "Tidak ada pesanan yang tercatat": "No orders recorded",
  "Pesanan baru dari perangkat ini akan muncul otomatis di sini.":
    "New orders from this device will appear here automatically.",
  "Setelah Anda pesan dari HP ini, pesanan dan status kurirnya muncul otomatis tanpa kode.":
    "After you order from this phone, the order and courier status appear automatically without a code.",
  "Pesanan dari nomor lain? Cek di sini":
    "Order from another number? Check here",
  "Cek pesanan dari nomor lain": "Check orders from another number",
  "Perangkat ini belum bisa memeriksa pesanan. Periksa koneksi lalu coba lagi.":
    "This device couldn't check orders yet. Check the connection and try again.",
  "Nomor belum bisa diperiksa. Periksa koneksi lalu coba lagi.":
    "The number can't be checked yet. Check your connection and try again.",
  "Nomor HP dan kode pesanan hanya tersimpan di HP ini, tidak dikirim ke perangkat lain.":
    "The phone number and order codes are only saved on this phone, not sent to other devices.",
  Keranjang: "Cart",
  "Keranjang belanja": "Shopping cart",
  "Lacak pesanan Anda": "Track your order",
  "Lacak lain": "Track another",
  "Cari produk": "Search products",
  "Cari": "Search",
  "Cari pesanan": "Search orders",
  "Cari nama produk": "Search product name",
  "Cari kode pesanan, nama, atau nomor HP": "Search order code, name, or phone number",
  "Cari produk, kategori, atau kebutuhan…": "Search products, categories, or needs…",
  "Cari nugget, bakso, kentang…": "Search nuggets, meatballs, potatoes…",
  "Cari nugget, bakso…": "Search nuggets, meatballs…",
  Semua: "All",
  "Semua produk": "All products",
  "Semua kategori": "All categories",
  "Semua pesanan": "All orders",
  "Semua stok produk aman.": "All product stock is safe.",
  "Semua pembayaran beres": "All payments settled",
  "Tampilkan semua": "Show all",
  "Lihat semua": "View all",
  "Lihat semua produk": "View all products",
  "Lihat semua pesanan": "View all orders",
  "Lihat katalog": "View catalog",
  "Lihat keranjang": "View cart",
  "Lihat toko": "View store",
  "Lihat": "View",
  "Lihat demo": "View demo",
  "Lanjut belanja": "Continue shopping",
  "Lanjut ke checkout": "Continue to checkout",
  "Kembali ke keranjang": "Back to cart",
  "Kembali ke toko": "Back to store",
  "Ke beranda": "Go to home",
  "Buka menu": "Open menu",
  "Tutup menu": "Close menu",
  "Buka menu admin": "Open admin menu",
  "Tutup menu admin": "Close admin menu",
  "Buka navigasi": "Open navigation",
  "Navigasi utama": "Main navigation",
  "Navigasi seluler": "Mobile navigation",
  "Navigasi cepat": "Quick navigation",
  "Navigasi admin": "Admin navigation",
  Breadcrumb: "Breadcrumb",
  Admin: "Admin",
  Kurir: "Courier",
  Developer: "Developer",
  "Panel admin": "Admin panel",
  "Panel developer": "Developer panel",
  "Halaman staff:": "Staff pages:",
  "Halaman kurir": "Courier page",
  "Halaman pelanggan": "Customer page",
  "Masuk": "Sign in",
  "Masuk admin": "Admin sign in",
  "Masuk kurir": "Courier sign in",
  "Masuk developer": "Developer sign in",
  "Keluar": "Sign out",
  "Keluar…": "Signing out…",
  "Keluar dari halaman kurir": "Sign out of courier page",
  "Administrator": "Administrator",
  "Halaman tidak ditemukan": "Page not found",
  "Muat ulang": "Reload",
  "Muat ulang tugas": "Reload tasks",
  "Coba lagi": "Try again",
  "Memeriksa…": "Checking…",
  "Memproses…": "Processing…",
  "Menyimpan…": "Saving…",
  "Memuat foto…": "Loading photo…",
  "Mengunggah…": "Uploading…",
  "Opsional": "Optional",
  "(opsional)": "(optional)",
  "Batal": "Cancel",
  "Simpan": "Save",
  "Hapus": "Delete",
  "Tambah": "Add",
  "Edit": "Edit",
  "Ubah": "Change",
  "Ya": "Yes",
  "Tidak jadi": "Never mind",
  "Semua hak dilindungi.": "All rights reserved.",
  "Bug baru": "New bugs",
  "Bug & error": "Bugs & errors",
  "Status layanan": "Service status",
  "Selamat datang di Yanti Frozen": "Welcome to Yanti Frozen",
  "Frozen food dari Probolinggo. Ambil di toko atau kami antar ke rumah.":
    "Frozen food from Probolinggo. Pick up at the store or we deliver.",
  "Mulai belanja": "Start shopping",
  "Lihat-lihat dulu": "Just browsing",
  "Tutup sambutan": "Close welcome",
  "Bahasa": "Language",
  "Tema": "Theme",
  "Terang": "Light",
  "Gelap": "Dark",
  "Ganti bahasa ke Inggris": "Switch language to English",
  "Ganti bahasa ke Indonesia": "Switch language to Indonesian",
  "Aktifkan mode gelap": "Turn on dark mode",
  "Aktifkan mode terang": "Turn on light mode",
  "Kata sandi admin": "Admin password",
  "Kata sandi kurir": "Courier password",
  "Kata sandi developer": "Developer password",
  "Masuk ke panel admin": "Sign in to admin panel",
  "Masuk ke halaman kurir": "Sign in to courier page",
  "Masuk ke panel developer": "Sign in to developer panel",
  "Kelola pesanan, pembayaran, produk, promo, dan laporan toko.":
    "Manage orders, payments, products, promos, and store reports.",
  "Cukup masukkan kata sandi tim kurir. Tidak perlu nomor HP.":
    "Just enter the courier team password. No phone number needed.",
  "Pantau error, kelola akun staff, dan periksa status sistem.":
    "Monitor errors, manage staff accounts, and check system status.",
  "Gagal masuk. Periksa kembali data Anda.":
    "Sign-in failed. Please check your details.",
  "Jaringan bermasalah. Periksa koneksi lalu coba lagi.":
    "Network problem. Check your connection and try again.",
  "Halaman ini hanya bisa dibuka dengan sandi developer. Semua sandi staff disimpan sebagai hash dan tidak pernah ditampilkan di sini.":
    "This page can only be opened with the developer password. All staff passwords are stored as hashes and never shown here.",
  "Google Sheets terhubung": "Google Sheets connected",
  "Data pesanan dan staff tersimpan di spreadsheet.":
    "Order and staff data is stored in the spreadsheet.",
  "belum aktif": "not active yet",
  "Isi FONNTE_TOKEN atau WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID di server agar pesanan baru dikirim otomatis.":
    "Set FONNTE_TOKEN or WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID on the server so new orders are sent automatically.",
  "Tambah admin": "Add admin",
  "Tambah kurir": "Add courier",
  "Tim pengantaran": "Delivery team",
  "Bank": "Bank",
  "Belum ditugaskan": "Not assigned yet",
  "Buka pesanan demo yang sedang diantar kurir.":
    "Open a demo order that the courier is delivering.",
  "Cara menerima pesanan": "How to receive the order",
  "Coba aktifkan": "Try enabling",
  "Filter aktif:": "Active filters:",
  "Filter status pesanan": "Order status filter",
  "Hapus semua": "Clear all",
  "Hapus semua?": "Clear all?",
  "Harga terendah": "Lowest price",
  "Harga tertinggi": "Highest price",
  "Hari ini": "Today",
  "Hari sebelumnya": "Previous day",
  "Ingin melihat contoh pelacakan?":
    "Want to see a tracking example?",
  "Isi data penerima dan pilih cara terima. Pesanan langsung masuk ke admin setelah Anda menekan buat pesanan.":
    "Fill in the recipient details and choose how to receive. The order goes straight to the admin after you place it.",
  "Yanti Frozen · Aplikasi kurir": "Yanti Frozen · Courier app",
  "Yanti Frozen · Panel admin · Data tersimpan aman":
    "Yanti Frozen · Admin panel · Data stored safely",
  "Yanti Frozen, ke beranda": "Yanti Frozen, go to home",
  "Keterangan": "Details",
  "Konfirmasi pesanan": "Confirm order",
  "Nama A–Z": "Name A–Z",
  "Otomatis dipotong 16:9 · 1600 × 900 piksel.":
    "Automatically cropped to 16:9 · 1600 × 900 pixels.",
  "Pantau pelacakan pelanggan": "Monitor customer tracking",
  "Perubahan langsung tampil di toko.":
    "Changes appear in the store immediately.",
  "Proses pesanan baru": "Process new orders",
  "Rekomendasi": "Recommended",
  "Sedang diantar": "Out for delivery",
  "Selamat, pesanan Anda gratis ongkir!":
    "Congrats, your order ships free!",
  "Setelah dikonfirmasi admin": "After admin confirmation",
  "Siap": "Ready",
  "TIDAK TAMPIL": "NOT SHOWN",
  "Tanggal": "Date",
  "Toko": "Store",
  "Tutup pengumuman": "Close announcement",
  "URL gambar QRIS": "QRIS image URL",
  "lagi untuk gratis ongkir": "more for free shipping",
  "untuk melacak. Admin akan mengonfirmasi lewat nomor WhatsApp Anda.":
    "to track. The admin will confirm via your WhatsApp number.",
  "baru": "new",
  "diproses": "processing",
  "selesai": "done",
  "Kesehatan sistem & akun staff": "System health & staff accounts",
  "Database": "Database",
  "Analitik": "Analytics",
  "Konfigurasi": "Configuration",
  "Operasional": "Operations",
  "Ringkasan": "Summary",
  "Ringkasan hari ini": "Today's summary",
  "Ringkasan pesanan": "Order summary",
  "Pengaturan toko": "Store settings",
  "Tampilan toko": "Storefront",
  "Kontribusi omzet": "Revenue contribution",

  // Header toko
  Buka: "Open",
  "Tutup sementara": "Temporarily closed",
  "setiap hari": "every day",
  "buka lagi": "reopens",
  "Gratis ongkir": "Free shipping",
  "min.": "min.",
  "Ambil di toko": "Pick up at store",
  "Antar kurir": "Courier delivery",
  "Lacak langsung": "Live tracking",
  "WhatsApp toko": "Store WhatsApp",
  "Balas 08.00–21.00": "Replies 08.00–21.00",
  "Belanja": "Shop",
  "Bantuan": "Help",
  "Pembayaran & pengiriman": "Payment & delivery",
  "Tunai": "Cash",
  "Transfer": "Bank transfer",
  "Probolinggo, Jawa Timur": "Probolinggo, East Java",
  "Frozen food siap masak. Ambil di toko atau minta diantar ke rumah.":
    "Frozen food ready to cook. Pick up at the store or have it delivered.",
  "Produk tetap beku sampai diterima": "Stays frozen until it arrives",
  "Buka setiap hari": "Open every day",
  "Ambil di toko atau antar kurir area Probolinggo. Ongkir":
    "Pick up at the store or courier delivery in Probolinggo. Delivery fee",
  ", gratis di atas": ", free over",
  "gratis di atas": "free over",
  "Butuh bantuan?": "Need help?",
  "Chat WhatsApp toko. Dibalas langsung oleh admin.":
    "Chat the store on WhatsApp. Answered directly by the admin.",
  "Produk bersertifikat halal": "Halal certified products",
  "Pembayaran diverifikasi admin": "Payments verified by admin",
  "Toko fisik di Probolinggo": "Physical store in Probolinggo",
  "Lokasi toko": "Store location",
  "Buka di Google Maps": "Open in Google Maps",
  "Buka peta lokasi toko": "Open store location map",
  "Google Maps": "Google Maps",
  "Link Google Maps": "Google Maps link",
  "Dibuka dari kartu lokasi di beranda dan tautan alamat di footer. Kosongkan bila belum ada peta.":
    "Opened from the location card on the home page and the address link in the footer. Leave empty if there is no map yet.",
  "Nama jalan, kelurahan, kota": "Street, district, city",
  "Admin siap membantu setiap hari": "The admin is ready to help every day",

  // Beranda
  "Frozen food · Kota Probolinggo": "Frozen food · Probolinggo",
  "Frozen food,": "Frozen food,",
  "siap masak": "ready to cook",
  "kapan saja.": "anytime.",
  "Pilih produk, lalu ambil di toko atau minta diantar. Bayar tunai, QRIS, atau transfer.":
    "Choose products, pick up at the store or have them delivered. Pay cash, QRIS, or transfer.",
  "Pesan antar atau ambil sendiri. Bayar tunai, QRIS, atau transfer.":
    "Order delivery or pick it up yourself. Pay cash, QRIS, or transfer.",
  "Tetap beku −18°C": "Stays frozen at −18°C",
  "Chat WhatsApp toko, dibalas langsung oleh admin.":
    "Chat the store on WhatsApp. Answered directly by the admin.",
  "Jam operasional": "Operating hours",
  "Frozen food siap masak dari Probolinggo. Ambil di toko atau minta diantar ke rumah.":
    "Frozen food ready to cook from Probolinggo. Pick up at the store or have it delivered.",
  "Ambil di toko atau antar kurir area Probolinggo.":
    "Pick up at the store or courier delivery in Probolinggo.",
  "Selalu beku −18°C": "Always frozen at −18°C",
  "Produk tetap beku sampai diterima.":
    "Stays frozen until you receive it.",
  "Ambil atau diantar": "Pickup or delivery",
  "Ongkir jelas, gratis di atas": "Clear delivery fee, free over",
  "Tiga cara bayar": "Three ways to pay",
  "Tunai, QRIS, atau transfer bank.": "Cash, QRIS, or bank transfer.",
  "Kategori": "Categories",
  "Pilih kategori": "Choose a category",
  "Paling dicari": "Most popular",
  "Produk unggulan": "Featured products",
  "Cara pesan": "How to order",
  "Produk": "Products",
  "Peta": "Map",
  "Chat langsung ke admin.": "Chat the admin directly.",
  "Tanpa daftar akun, cukup nama dan nomor HP.":
    "No account needed, just your name and phone number.",
  "Masukkan ke keranjang.": "Add to the cart.",
  "Nama dan nomor HP.": "Name and phone number.",
  "Tunai, QRIS, atau transfer.": "Cash, QRIS, or transfer.",
  "Ambil sendiri atau diantar.": "Pick up yourself or have it delivered.",
  "Pesan dalam 4 langkah": "Order in 4 steps",
  "Tidak perlu daftar akun. Cukup nama dan nomor HP saat checkout.":
    "No account needed. Just your name and phone number at checkout.",
  "Pilih produk": "Choose products",
  "Cari atau telusuri kategori, lalu masukkan ke keranjang.":
    "Search or browse categories, then add to cart.",
  "Isi data": "Fill in details",
  "Nama, nomor HP, dan pilih ambil di toko atau antar.":
    "Name, phone number, and choose pickup or delivery.",
  "Bayar": "Pay",
  "Tunai di toko, QRIS, atau transfer bank.": "Cash at the store, QRIS, or bank transfer.",
  "Terima pesanan": "Receive order",
  "Ambil sendiri atau ikuti kurir lewat halaman riwayat.":
    "Pick it up yourself or follow the courier on the order history page.",
  "Belum ada produk dipilih. Buka katalog, lalu tekan Tambah.":
    "No products picked yet. Open the catalog, then tap Add.",
  "Ada di keranjang": "Already in cart",
  "Stok habis": "Out of stock",
  "Stok menipis": "Low stock",
  "produk ditemukan": "products found",
  "UNGGULAN": "FEATURED",
  "Promo": "Promo",
  "Aneka frozen food Yanti Frozen di atas es":
    "Yanti Frozen's frozen food assortment on ice",
  "Contoh: Chicken Nugget": "Example: Chicken Nugget",
  "Contoh: Hemat 30%": "Example: Save 30%",
  "Contoh: Siti Aisyah": "Example: Siti Aisyah",

  // Katalog & produk
  "Semua frozen food yang tersedia di toko. Stok dan harga diperbarui langsung oleh admin.":
    "All frozen food available in the store. Stock and prices are updated directly by the admin.",
  "antar kurir area Probolinggo": "courier delivery in Probolinggo",
  "Filter kategori": "Filter category",
  "Hanya yang tersedia": "In stock only",
  "Urutkan produk": "Sort products",
  "rekomendasi": "recommended",
  "harga terendah": "lowest price",
  "harga tertinggi": "highest price",
  "nama A–Z": "name A–Z",
  "Hapus filter": "Clear filters",
  "Coba ubah filter status atau kata kunci pencarian.":
    "Try changing the status filter or search keywords.",
  "Coba kata kunci lain atau lihat semua produk. Admin toko siap membantu lewat WhatsApp.":
    "Try another keyword or view all products. The store admin is ready to help on WhatsApp.",
  "Ubah kata kunci atau kategori.": "Change the keyword or category.",
  "Tambah ke keranjang": "Add to cart",
  "Tanya ketersediaan": "Ask availability",
  "Produk lain di kategori ini": "Other products in this category",
  "Foto ilustrasi produk. Kemasan dapat berbeda sesuai stok.":
    "Illustrative photo. Packaging may vary depending on stock.",
  "Beku −18°C": "Frozen at −18°C",
  "Tetap beku": "Keeps frozen",
  "Dikemas dengan ice gel": "Packed with ice gel",
  "Produk sedang kosong. Hubungi toko untuk ketersediaan berikutnya.":
    "This product is currently out of stock. Contact the store for the next availability.",
  "Produk tidak ditemukan": "Product not found",
  "Satuan": "Unit",
  "Deskripsi": "Description",
  "Stok": "Stock",
  "stok tersedia": "in stock",
  "pack": "pack",
  "pack / pcs / kg": "pack / pcs / kg",
  "Beli sekarang": "Buy now",
  "Harga normal": "Regular price",
  "Harga promo": "Promo price",
  "Dihitung saat checkout": "Calculated at checkout",
  "Gratis": "Free",
  "Ongkir": "Delivery fee",
  "Subtotal": "Subtotal",
  "Total": "Total",
  "Total barang": "Items total",
  "Total bayar": "Total to pay",
  "Total tagihan": "Amount due",
  "Keranjang masih kosong": "Your cart is empty",
  "Tambahkan produk ke keranjang sebelum checkout.":
    "Add products to your cart before checkout.",
  "Keranjang tersimpan di perangkat ini. Harga final dicek ulang oleh sistem saat pesanan dibuat.":
    "Your cart is saved on this device. Final prices are rechecked when the order is created.",
  "Periksa jumlah produk sebelum melanjutkan ke checkout.":
    "Check product quantities before continuing to checkout.",
  "Kode": "Code",
  "Kode pesanan": "Order code",
  "Simpan kode": "Save code",
  "Simpan kode pesanan Anda. Tanpa akun, kode ini yang dipakai untuk membuka status dan posisi kurir kapan saja.":
    "Save your order code. Without an account, this code lets you open the status and courier position anytime.",
  "Masukkan kode pesanan yang tertera saat checkout. Contoh: YF261110-4821.":
    "Enter the order code shown at checkout. Example: YF261110-4821.",
  "Pesanan tidak ditemukan": "Order not found",
  "Pesanan dengan kode itu tidak ditemukan. Periksa kembali huruf dan angkanya, atau hubungi toko.":
    "No order found with that code. Check the letters and numbers again, or contact the store.",
  "Tautan mungkin sudah berubah. Kembali ke beranda atau lacak pesanan Anda lewat kode.":
    "The link may have changed. Go back home or track your order using the code.",
  "Tautan mungkin sudah berubah. Kembali ke beranda atau buka riwayat pesanan Anda.":
    "The link may have changed. Go back home or open your order history.",

  // Checkout
  "Checkout": "Checkout",
  "Belum ada produk": "No products yet",
  "Data pembeli": "Buyer details",
  "Nama lengkap": "Full name",
  "Nomor HP / WhatsApp": "Phone / WhatsApp number",
  "Nomor HP dipakai admin untuk mengonfirmasi pesanan.":
    "The admin uses your phone number to confirm the order.",
  "Cara menerima": "How to receive",
  "Metode penerimaan": "Fulfillment method",
  "Antar ke rumah": "Deliver to home",
  "Gratis · siap setelah admin konfirmasi": "Free · ready after admin confirmation",
  "Alamat pengantaran": "Delivery address",
  "Detail alamat": "Address details",
  "Pilih lokasi saya": "Use my location",
  "Tekan Pilih lokasi saya, atau ketuk peta untuk menandai titik.":
    "Press Use my location, or tap the map to drop a pin.",
  "Tekan Pilih lokasi saya saat berada di rumah. Kalau titiknya belum tepat, ketuk atau geser pin di peta.":
    "Press Use my location while you are at home. If the pin is not exact, tap or drag it on the map.",
  "Titik sudah diatur. Geser pin bila belum tepat.":
    "The point is set. Drag the pin if it is not exact.",
  "Nama jalan, nomor rumah, kelurahan, kecamatan, patokan…":
    "Street name, house number, village, district, landmark…",
  "Kurir akan menghubungi nomor HP saat tiba.":
    "The courier will call your phone number upon arrival.",
  "Jadwal": "Schedule",
  "Jadwal (opsional)": "Schedule (optional)",
  "Jadwal kirim / ambil": "Delivery / pickup schedule",
  "Pilihan jadwal kirim / ambil": "Delivery / pickup schedule options",
  "Satu jadwal per baris. Daftar ini muncul di checkout dan bisa diubah kapan saja. Minimal satu jadwal.":
    "One schedule per line. This list appears at checkout and can be changed anytime. At least one schedule.",
  "Pilih Secepatnya, atau slot kirim/ambil yang tersedia.":
    "Choose As soon as possible, or an available delivery/pickup slot.",
  "Toko sedang tutup, jadi pesanan diproses pada slot yang Anda pilih.":
    "The store is closed, so your order will be processed in the slot you choose.",
  "Ambil di": "Pick up at",
  "Tunjukkan kode pesanan ke kasir.": "Show the order code to the cashier.",
  "Pembayaran": "Payment",
  "Metode pembayaran": "Payment method",
  "Scan kode QRIS dari admin": "Scan the store's QRIS code",
  "Transfer bank, lalu konfirmasi": "Bank transfer, then confirm",
  "Bayar saat ambil atau saat kurir tiba":
    "Pay on pickup or when the courier arrives",
  "Belum tersedia saat toko tutup": "Not available while the store is closed",
  "Cantumkan kode pesanan di berita transfer. Admin akan memverifikasi.":
    "Include the order code in the transfer note. The admin will verify it.",
  "Catatan pembeli": "Buyer note",
  "Catatan pesanan": "Order note",
  "Catatan": "Note",
  "Contoh: pisahkan kantong beku, titip di satpam, jangan dibel…":
    "Example: separate frozen bags, leave with security, do not ring…",
  "Scan dengan aplikasi bank atau e-wallet, lalu bayar":
    "Scan with your bank or e-wallet app, then pay",
  "Scan dengan aplikasi bank atau e-wallet. Admin menandai lunas setelah pembayaran masuk.":
    "Scan with your bank or e-wallet app. The admin marks it paid once the payment arrives.",
  "Gambar QRIS belum diatur toko. Pilih tunai atau transfer, atau hubungi admin lewat WhatsApp.":
    "The store hasn't set a QRIS image yet. Choose cash or transfer, or contact the admin on WhatsApp.",
  "Gambar QRIS belum diatur toko. Bayar tunai di kasir atau hubungi admin lewat WhatsApp.":
    "The store hasn't set a QRIS image yet. Pay cash at the cashier or contact the admin on WhatsApp.",
  "Toko sedang tutup": "The store is closed",
  "Toko sedang tutup.": "The store is closed.",
  "Toko sedang tutup. Silakan pilih jadwal kirim/ambil yang tersedia.":
    "The store is closed. Please choose an available delivery/pickup schedule.",
  "Saat tutup, pembeli melihat pemberitahuan dan hanya bisa memilih jadwal serta membayar tunai.":
    "While closed, buyers see a notice and can only choose a schedule and pay cash.",
  "Toko sedang tutup, jadi pembayaran online belum bisa. Pesanan akan dijadwalkan dan dibayar tunai saat diserahkan.":
    "The store is closed, so online payment isn't available. Your order will be scheduled and paid in cash on handover.",
  "Pembayaran QRIS dan transfer belum bisa dilakukan. Pilih jadwal kirim/ambil di bawah, lalu bayar tunai saat pesanan diserahkan.":
    "QRIS and transfer payments aren't available yet. Choose a delivery/pickup schedule below, then pay cash when the order is handed over.",
  "Jadwalkan pesanan": "Schedule order",
  "Buat pesanan": "Place order",
  "Dikonfirmasi admin pada jam operasional":
    "Confirmed by the admin during operating hours",
  "Diproses saat toko buka": "Processed when the store opens",
  "Keranjang masih kosong.": "Your cart is still empty.",
  "Pesanan gagal dibuat. Coba lagi.": "Failed to create the order. Please try again.",
  "Jaringan sedang bermasalah. Periksa koneksi lalu coba lagi.":
    "There's a network problem. Check your connection and try again.",

  // Pesanan & pelacakan
  "Status pesanan": "Order status",
  "Pesanan diterima": "Order received",
  "Pesanan masuk dan menunggu konfirmasi admin.":
    "The order is in and awaiting admin confirmation.",
  "Dikonfirmasi": "Confirmed",
  "Pembayaran dan pesanan sudah diverifikasi.":
    "Payment and order have been verified.",
  "Sedang disiapkan": "Being prepared",
  "Produk diambil dari freezer dan dikemas.":
    "Products are taken from the freezer and packed.",
  "Siap diambil": "Ready for pickup",
  "Diantar kurir": "Out for delivery",
  "Kurir membawa pesanan menuju alamat Anda.":
    "The courier is bringing your order to your address.",
  "Selesai": "Completed",
  "Pesanan sudah diterima. Terima kasih!":
    "Your order has been received. Thank you!",
  "Pesanan sudah diambil. Terima kasih!":
    "Your order has been picked up. Thank you!",
  "Pesanan dibatalkan": "Order cancelled",
  "Pesanan ini dibatalkan. Hubungi toko bila Anda sudah melakukan pembayaran.":
    "This order was cancelled. Contact the store if you have already paid.",
  "Pesanan berhasil dibuat": "Order placed successfully",
  "Status sekarang": "Current status",
  "Pelacakan kurir": "Courier tracking",
  "Pengambilan di toko": "Store pickup",
  "Menunggu kurir mulai mengantar": "Waiting for the courier to start delivery",
  "Kurir belum ditugaskan": "No courier assigned yet",
  "Admin menentukan kurir saat pesanan siap. Peta muncul di sini.":
    "The admin assigns a courier when the order is ready. The map appears here.",
  "Titik lokasi antar pesanan ini tidak tersimpan, jadi peta tidak bisa ditampilkan. Hubungi toko bila perlu.":
    "The delivery location for this order wasn't saved, so the map can't be shown. Contact the store if needed.",
  "Lokasi GPS aktif ·": "GPS location active ·",
  "Lokasi diperbarui otomatis saat kurir berangkat":
    "Location updates automatically when the courier leaves",
  "Hubungi": "Contact",
  "Hubungi toko": "Contact store",
  "Salin kode": "Copy code",
  "Tersalin": "Copied",
  "Rincian pesanan": "Order details",
  "Info pesanan": "Order info",
  "Cara terima": "Fulfillment",
  "Perjalanan pesanan": "Order journey",
  "Lunas": "Paid",
  "Belum dibayar": "Unpaid",
  "Pembayaran sudah dikonfirmasi admin. Terima kasih.":
    "Payment has been confirmed by the admin. Thank you.",
  "Diverifikasi manual oleh admin toko": "Verified manually by the store admin",
  "Tunjukkan halaman ini di kasir untuk pembayaran QRIS. Admin akan menandai lunas setelah pembayaran masuk.":
    "Show this page at the cashier to pay with QRIS. The admin marks it paid once the payment arrives.",
  "Bayar tunai saat mengambil pesanan": "Pay cash when picking up the order",
  " atau saat kurir tiba.": " or when the courier arrives.",
  " di toko.": " at the store.",
  "Lokasi ambil": "Pickup location",
  "Jadwal Anda": "Your schedule",
  "Tunjukkan kode": "Show code",
  "ke kasir. Pesanan disimpan di freezer sampai Anda ambil.":
    "to the cashier. The order stays in the freezer until you pick it up.",
  "Dibuat": "Created",
  "atas nama": "for",
  "Status diperbarui oleh admin": "Status updated by the admin",
  "Status terakhir diperbarui": "Last status update",
  "Pesanan selesai": "Order completed",
  "Pesanan": "Orders",
  "Pesanan terbaru": "Latest orders",
  "Detail pesanan": "Order details",
  "Buka dan konfirmasi pesanan:": "Open and confirm the order:",
  "Setelah dikonfirmasi, pesanan antar otomatis masuk ke halaman kurir.":
    "After confirmation, delivery orders automatically appear on the courier page.",

  // Ulasan
  "Nilai pesanan ini": "Rate this order",
  "Terima kasih atas ulasan Anda": "Thank you for your review",
  "Bintang dan ulasan Anda sudah masuk ke laporan admin toko.":
    "Your stars and review have been added to the store admin report.",
  "Bintang dan ulasan membantu toko memperbaiki layanan.":
    "Stars and reviews help the store improve its service.",
  "Belum dinilai": "Not rated yet",
  "Ulasan (opsional)": "Review (optional)",
  "Contoh: barang masih beku, kurir cepat dan ramah.":
    "Example: items were still frozen, the courier was fast and friendly.",
  "Kirim ulasan": "Send review",
  "Mengirim…": "Sending…",
  "Pilih bintang dulu ya.": "Choose a star rating first.",
  "Ulasan gagal disimpan.": "The review couldn't be saved.",
  "Ulasan sudah tersimpan.": "Review saved.",
  "Ulasan pelanggan": "Customer reviews",
  "Belum ada ulasan pada periode ini.": "No reviews in this period.",
  "Tanpa catatan tertulis.": "No written note.",
  "Menampilkan 8 ulasan terbaru. Unduh CSV untuk melihat semua.":
    "Showing the 8 latest reviews. Download the CSV to see all.",

  // Pelacakan peta
  "Estimasi tiba": "Estimated arrival",
  "RUTE PENGANTARAN": "DELIVERY ROUTE",
  "KURIR DI JALAN": "COURIER ON THE WAY",
  "Lokasi kurir saat pengantaran": "Courier location during delivery",
  "Lihat posisi GPS kurir": "View courier GPS position",
  "GPS belum tersedia": "GPS not available yet",
  "Lokasi live dibagikan ke pelanggan": "Live location shared with customers",
  "Bagikan lokasi live": "Share live location",
  "Hentikan pembagian lokasi": "Stop sharing location",
  "Izin lokasi ditolak": "Location permission denied",
  "Izinkan akses lokasi agar pelanggan dapat memantau posisi Anda sampai pesanan tiba.":
    "Allow location access so customers can follow your position until the order arrives.",
  "Pelanggan tidak bisa melihat posisi Anda. Aktifkan izin lokasi di pengaturan peramban, lalu tekan coba lagi.":
    "Customers can't see your position. Enable location permission in your browser settings, then try again.",
  "Perangkat tidak mengirim lokasi. Pelanggan tetap bisa melihat status pesanan.":
    "The device isn't sending a location. Customers can still see the order status.",
  "Kurir pengantar": "Delivery courier",
  "Tim kurir": "Courier team",
  "Tugas": "Tasks",
  "Tugas antar hari ini": "Today's delivery tasks",
  "Tugas berikutnya": "Next task",
  "Belum ada tugas antar": "No delivery tasks yet",
  "Tugas akan muncul otomatis saat admin mengonfirmasi pesanan antar. Halaman ini memuat ulang setiap 40 detik.":
    "Tasks appear automatically when the admin confirms a delivery order. This page reloads every 40 seconds.",
  "Mulai antar": "Start delivery",
  "Selesaikan pesanan": "Complete order",
  "Serahkan ke kurir": "Hand over to courier",
  "Rute pengantaran": "Delivery route",

  // Login
  "Masukkan kata sandi": "Enter password",
  "Halaman ini khusus staff Yanti Frozen. Pembeli tidak perlu membuat akun.":
    "This page is for Yanti Frozen staff only. Buyers don't need an account.",
  "Kata sandi": "Password",
  "Sandi": "Password",

  // Admin
  "Selamat datang, Admin": "Welcome, Admin",
  "Omzet": "Revenue",
  "Omzet hari ini": "Today's revenue",
  "Pesanan hari ini": "Today's orders",
  "Produk terjual": "Products sold",
  "Rata-rata pesanan": "Average order",
  "Penjualan 7 hari terakhir": "Sales in the last 7 days",
  "Produk terlaris": "Best-selling products",
  "Perlu verifikasi": "Needs verification",
  "Kelola pesanan": "Manage orders",
  "Kelola status, verifikasi pembayaran, dan tugaskan kurir.":
    "Manage status, verify payments, and assign couriers.",
  "Produk & stok": "Products & stock",
  "Kelola": "Manage",
  "Promo & banner": "Promos & banners",
  "Laporan penjualan": "Sales report",
  "Riwayat transaksi": "Transaction history",
  "Tidak ada pembayaran yang menunggu verifikasi.":
    "No payments waiting for verification.",
  "Status": "Status",
  "Waktu": "Time",
  "Pelanggan": "Customer",
  "Metode": "Method",
  "Tambah produk": "Add product",
  "Nama produk": "Product name",
  "Deskripsi singkat": "Short description",
  "Isi, berat, dan cara penyajian produk.":
    "Contents, weight, and how to serve the product.",
  "Foto produk": "Product photo",
  "Atur foto": "Adjust photo",
  "Ganti foto": "Change photo",
  "Belum ada foto": "No photo yet",
  "Pakai tautan gambar": "Use image link",
  "Tautan gambar produk": "Product image link",
  "Pratinjau foto": "Photo preview",
  "Atur potongan foto": "Crop photo",
  "Geser foto, atur zoom agar produk pas di tengah.":
    "Drag the photo, adjust zoom so the product is centered.",
  "Perbesar atau perkecil foto": "Zoom photo in or out",
  "Tengahkan": "Center",
  "Tutup pengaturan foto": "Close photo settings",
  "Produk aktif dan bisa dibeli": "Product is active and available",
  "Tutup formulir produk": "Close product form",
  "Hapus produk?": "Delete product?",
  "Produk akan dihapus dari katalog. Riwayat pesanan lama tetap tersimpan.":
    "The product will be removed from the catalog. Previous order history stays saved.",
  "Buat promo": "Create promo",
  "Buat promo pertama": "Create your first promo",
  "Buat banner atau pengumuman untuk tampil di beranda.":
    "Create a banner or announcement to show on the homepage.",
  "Banner beranda": "Homepage banner",
  "Banner tampil besar di beranda, pengumuman muncul di atas halaman toko.":
    "The banner appears large on the homepage; announcements appear at the top of store pages.",
  "Pengumuman atas": "Top announcement",
  "Judul": "Title",
  "Label kecil": "Small label",
  "Tayang": "Live",
  "Mulai tayang": "Starts",
  "Berakhir": "Ends",
  "Atur tampilan dan masa tayang.": "Adjust appearance and display period.",
  "Jelaskan promo dengan kalimat singkat.":
    "Describe the promo in a short sentence.",
  "Aktifkan promo sekarang": "Enable promo now",
  "Hapus promo?": "Delete promo?",
  "Tutup formulir promo": "Close promo form",
  "Belum ada promo": "No promos yet",
  "Tujuan tombol": "Button target",
  "Gunakan alamat halaman, misalnya /katalog atau /produk/chicken-nugget.":
    "Use a page address, e.g. /catalog or /product/chicken-nugget.",
  "Foto banner": "Banner photo",
  "Pilih & atur foto banner": "Choose & adjust banner photo",
  "Rasio tetap 16:9 · 1600 × 900 piksel": "Fixed 16:9 ratio · 1600 × 900 pixels",
  "Otomatis dipotong 16:9 · 1600 × 900 piksel":
    "Automatically cropped to 16:9 · 1600 × 900 pixels",
  "Pilih & atur foto": "Choose & adjust photo",
  "Rasio tetap 4:3 · 900 × 675 piksel": "Fixed 4:3 ratio · 900 × 675 pixels",
  "Foto otomatis dipotong ke rasio 4:3 berukuran 900 × 675 piksel.":
    "The photo is automatically cropped to a 4:3 ratio at 900 × 675 pixels.",
  "Identitas toko": "Store identity",
  "Nama toko": "Store name",
  "Nomor WhatsApp toko": "Store WhatsApp number",
  "Nomor WhatsApp admin (notifikasi pesanan)":
    "Admin WhatsApp number (order notifications)",
  "Alamat toko": "Store address",
  "Jam buka": "Opening hours",
  "Keterangan saat toko tutup": "Message when the store is closed",
  "Status toko": "Store status",
  "TOKO BUKA": "STORE OPEN",
  "TOKO TUTUP": "STORE CLOSED",
  "Buka atau tutup toko": "Open or close the store",
  "Ongkos kirim": "Delivery fee",
  "Ongkir per pesanan (Rp)": "Delivery fee per order (Rp)",
  "Gratis ongkir mulai (Rp)": "Free shipping from (Rp)",
  "Berlaku untuk pengantaran. Pembeli melihat angkanya di keranjang dan checkout.":
    "Applies to delivery. Buyers see the amount in the cart and checkout.",
  "Tampil di header, halaman kontak, dan pesan pesanan.":
    "Shown in the header, contact page, and order messages.",
  "Data ini muncul sebagai instruksi pembayaran bagi pembeli.":
    "This info appears as payment instructions for buyers.",
  "Rekening bank": "Bank accounts",
  "Rekening bank untuk transfer": "Bank accounts for transfer",
  "Nama merchant QRIS": "QRIS merchant name",
  "Gambar QRIS": "QRIS image",
  "Gambar QRIS diunggah lewat panel developer.":
    "The QRIS image is uploaded from the developer panel.",
  "Simpan pengaturan": "Save settings",
  "Perubahan langsung dipakai setelah disimpan.":
    "Changes take effect right after saving.",
  "Pengaturan tersimpan dan langsung dipakai di toko.":
    "Settings saved and applied to the store immediately.",
  "Atur identitas, ongkir, dan instruksi pembayaran.":
    "Set identity, delivery fees, and payment instructions.",
  "Verifikasi pembayaran": "Verify payment",
  "Cocokkan dana masuk sebelum menyiapkan pesanan.":
    "Match the incoming funds before preparing the order.",
  "Periksa dana masuk di rekening atau mutasi QRIS sebelum menandai lunas.":
    "Check incoming funds in the bank account or QRIS history before marking it paid.",
  "Batalkan pesanan": "Cancel order",
  "Stok produk otomatis dikembalikan. Tindakan ini tidak bisa diurungkan.":
    "Product stock is automatically restored. This action cannot be undone.",
  "Tandai siap diambil": "Mark ready for pickup",
  "Mulai siapkan pesanan": "Start preparing order",
  "Tandai sudah diterima": "Mark as received",
  "Pesanan batal tidak dihitung.": "Cancelled orders are not counted.",
  "Belum ada pesanan masuk.": "No orders yet.",
  "Belum ada penjualan pada periode ini.": "No sales in this period.",
  "Belum ada pengantaran yang selesai.": "No completed deliveries yet.",
  "Tidak ada transaksi pada periode ini.": "No transactions in this period.",
  "Tidak ada laporan pada filter ini.": "No reports in this filter.",
  "Tidak termasuk pesanan yang dibatalkan.": "Excludes cancelled orders.",
  "Berdasarkan jumlah item terjual pada periode ini.":
    "Based on items sold in this period.",
  "Pilih rentang waktu, lalu unduh riwayat transaksi bila perlu.":
    "Choose a date range, then download the transaction history if needed.",
  "Unduh riwayat CSV": "Download CSV history",
  "Menampilkan 20 terbaru. Unduh CSV untuk melihat semua.":
    "Showing the latest 20. Download CSV to see everything.",
  "Produk pesanan": "Ordered products",
  "Riwayat pengantaran": "Delivery history",
  "Pengantaran": "Deliveries",
  "total 7 hari": "7-day total",
  "hari ini": "today",
  "Diambil di toko": "Picked up at store",
  "Diantar": "Delivered",
  "Disiapkan": "Prepared",
  "Terjadwal": "Scheduled",

  // Developer
  "Akun admin": "Admin accounts",
  "Akun kurir": "Courier accounts",
  "Tambah akun admin": "Add admin account",
  "Tambah akun kurir": "Add courier account",
  "Tambah admin, ganti sandi, atau nonaktifkan akses.":
    "Add admins, change passwords, or disable access.",
  "Atur identitas, sandi, dan status aktif kurir.":
    "Manage identity, passwords, and courier active status.",
  "Nama admin": "Admin name",
  "Nama admin baru": "New admin name",
  "Nomor HP (opsional)": "Phone number (optional)",
  "Nomor HP admin": "Admin phone number",
  "Nomor HP admin baru": "New admin phone number",
  "Sandi admin baru": "New admin password",
  "Nama kurir": "Courier name",
  "Nama kurir baru": "New courier name",
  "Nomor HP kurir": "Courier phone number",
  "Nomor HP kurir baru": "New courier phone number",
  "Kendaraan & nomor polisi": "Vehicle & license plate",
  "Kendaraan kurir": "Courier vehicle",
  "Kendaraan kurir baru": "New courier vehicle",
  "Sandi kurir baru": "New courier password",
  "Sandi baru (kosongkan bila tetap)": "New password (leave empty to keep)",
  "Sandi minimal 6 karakter": "Password at least 6 characters",
  "Minimal 6 karakter": "At least 6 characters",
  "Simpan sandi": "Save password",
  "Nonaktifkan": "Disable",
  "Aktifkan": "Enable",
  "Aktif": "Active",
  "Nonaktif": "Inactive",
  "Tanpa nomor HP": "No phone number",
  "Hapus laporan bug": "Delete bug report",
  "Error dari browser pengunjung tercatat otomatis di sini.":
    "Errors from visitors' browsers are recorded here automatically.",
  "Proses": "Process",
  "Toko & pembayaran": "Store & payment",
  "Ubah nomor toko, gambar QRIS, dan rekening yang tampil saat pembeli memilih QRIS atau transfer.":
    "Change the store number, QRIS image, and bank accounts shown when buyers choose QRIS or transfer.",
  "Nomor ini tampil di header, footer, dan tautan WhatsApp toko.":
    "This number appears in the header, footer, and store WhatsApp links.",
  "Simpan nama & rekening": "Save name & accounts",
  "Unggah gambar": "Upload image",
  "Ganti gambar": "Replace image",
  "Simpan URL": "Save URL",
  "Belum ada gambar QRIS": "No QRIS image yet",
  "atau tempel URL gambar QRIS": "or paste a QRIS image URL",
  "PNG/JPG/WEBP maksimal 4 MB. Bila unggah belum aktif, tempel URL gambar dari Google Drive atau penyimpanan lain.":
    "PNG/JPG/WEBP up to 4 MB. If upload isn't active, paste an image URL from Google Drive or another storage.",
  "Nomor rekening": "Account number",
  "Atas nama": "Account name",
  "Tambah rekening": "Add account",
  "Belum ada rekening. Pembeli hanya bisa memakai tunai atau QRIS.":
    "No bank accounts yet. Buyers can only use cash or QRIS.",
  "Buka spreadsheet": "Open spreadsheet",
  "Notifikasi WhatsApp": "WhatsApp notifications",
  "Nomor admin:": "Admin number:",
  "Data akun tidak valid.": "Invalid account data.",
  "Data kurir tidak valid.": "Invalid courier data.",
  "Perubahan tersimpan.": "Changes saved.",
  "Perubahan gagal disimpan.": "Failed to save changes.",
  "Batal edit admin": "Cancel admin edit",
  "Batal edit kurir": "Cancel courier edit",

  // Validasi & pesan server
  "Nama minimal 2 karakter.": "Name must be at least 2 characters.",
  "Nama staff minimal 2 karakter.": "Staff name must be at least 2 characters.",
  "Nama kurir minimal 2 karakter.": "Courier name must be at least 2 characters.",
  "Nomor HP tidak valid.": "Invalid phone number.",
  "Nomor HP kurir tidak valid.": "Invalid courier phone number.",
  "Nomor HP itu sudah dipakai kurir lain.":
    "That phone number is already used by another courier.",
  "Alamat pengantaran wajib diisi minimal 8 karakter.":
    "Delivery address must be at least 8 characters.",
  "Metode pengambilan tidak valid.": "Invalid fulfillment method.",
  "Metode pembayaran tidak valid.": "Invalid payment method.",
  "Ada produk yang sudah tidak tersedia.":
    "Some products are no longer available.",
  "Jadwal yang dipilih tidak tersedia. Muat ulang halaman.":
    "The selected schedule isn't available. Reload the page.",
  "Jumlah produk tidak valid.": "Invalid product quantity.",
  "Pesanan gagal dibuat.": "Failed to create the order.",
  "Akses ditolak. Silakan masuk terlebih dahulu.":
    "Access denied. Please sign in first.",
  "Data pesanan tidak valid.": "Invalid order data.",
  "Data pengaturan tidak valid.": "Invalid settings data.",
  "Gambar gagal diproses. Coba file lain.":
    "The image couldn't be processed. Try another file.",
  "Format gambar harus JPG, PNG, atau WEBP.":
    "Image format must be JPG, PNG, or WEBP.",
  "Berkas gambar tidak ditemukan.": "Image file not found.",
  "Google Sheets belum terhubung. Isi GOOGLE_SHEETS_URL dan GOOGLE_SHEETS_KEY di Environment Variables Vercel, lalu redeploy.":
    "Google Sheets isn't connected. Set GOOGLE_SHEETS_URL and GOOGLE_SHEETS_KEY in Vercel Environment Variables, then redeploy.",
  "Banner tampil besar di beranda. Pengumuman atas sudah tidak dipakai, jadi promo tidak menumpuk.":
    "The banner appears large on the homepage. Top announcements are no longer used, so promos don't pile up.",
  "Buat banner untuk tampil di beranda.":
    "Create a banner to show on the homepage.",
  "Pengumuman lama": "Old announcement",
  "Pengumuman lama · sudah tidak tampil di toko":
    "Old announcement · no longer shown in the store",
  "Hapus promo ini bila ingin membersihkan daftar.":
    "Delete this promo to clean up the list.",
  "Simpan nota": "Save receipt",
  "Cetak": "Print",
  "Menyiapkan…": "Preparing…",
  "Salin rekening": "Copy account",
  "Nota gagal dibuat. Coba lagi.": "The receipt couldn't be created. Try again.",
  "Nota tersimpan di folder unduhan.": "Receipt saved to your downloads folder.",
  "Pilih Simpan gambar untuk menyimpan ke galeri.":
    "Choose Save image to keep it in your gallery.",
  "Simpan nota ke galeri atau folder unduhan":
    "Save the receipt to your gallery or downloads folder",
  "Cara mengaktifkan unggah file (sekali saja)":
    "How to enable file uploads (one time only)",
  "Unggah file belum aktif karena Blob belum tersambung ke proyek ini. Buka Vercel → Storage → Blob → Connect to Project pada proyek yang menampilkan toko, lalu redeploy. Sementara itu tempel tautan gambar di kolom URL.":
    "File upload isn't active because Blob isn't connected to this project. Open Vercel → Storage → Blob → Connect to Project on the project that serves the store, then redeploy. Meanwhile, paste an image link in the URL field.",
};

const BULAN: Record<string, string> = {
  Jan: "Jan",
  Feb: "Feb",
  Mar: "Mar",
  Apr: "Apr",
  Mei: "May",
  Jun: "Jun",
  Jul: "Jul",
  Agu: "Aug",
  Sep: "Sep",
  Okt: "Oct",
  Nov: "Nov",
  Des: "Dec",
  Januari: "January",
  Februari: "February",
  Maret: "March",
  April: "April",
  Juni: "June",
  Juli: "July",
  Agustus: "August",
  September: "September",
  Oktober: "October",
  November: "November",
  Desember: "December",
};

const HARI: Record<string, string> = {
  Senin: "Monday",
  Selasa: "Tuesday",
  Rabu: "Wednesday",
  Kamis: "Thursday",
  Jumat: "Friday",
  Sabtu: "Saturday",
  Minggu: "Sunday",
  Sen: "Mon",
  Sel: "Tue",
  Rab: "Wed",
  Kam: "Thu",
  Jum: "Fri",
  Sab: "Sat",
  Min: "Sun",
};

function aturan(teks: string): string | undefined {
  let m = teks.match(/^Ongkir jelas, gratis di atas (.+)\.$/);
  if (m) return `Clear delivery fee, free over ${m[1]}.`;
  m = teks.match(/^, gratis di atas (.+)\.$/);
  if (m) return `, free over ${m[1]}.`;
  m = teks.match(/^Yanti Frozen\. Semua hak dilindungi\.$/);
  if (m) return "Yanti Frozen. All rights reserved.";
  m = teks.match(/^(\d+) produk$/);
  if (m) return `${m[1]} ${m[1] === "1" ? "product" : "products"}`;
  m = teks.match(/^(\d+) pesanan baru$/);
  if (m) return `${m[1]} new ${m[1] === "1" ? "order" : "orders"}`;
  m = teks.match(/^(\d+) pesanan$/);
  if (m) return `${m[1]} ${m[1] === "1" ? "order" : "orders"}`;
  m = teks.match(/^Sisa (\d+) pack$/);
  if (m) return `Only ${m[1]} left`;
  m = teks.match(/^(\d+) dari 5$/);
  if (m) return `${m[1]} of 5`;
  m = teks.match(/^Beri (\d+) bintang$/);
  if (m) return `Rate ${m[1]} star${m[1] === "1" ? "" : "s"}`;
  m = teks.match(/^Diskon hingga (\d+)% untuk produk pilihan$/);
  if (m) return `Up to ${m[1]}% off selected products`;
  m = teks.match(/^Gratis ongkir karena belanja ≥ (.+)$/);
  if (m) return `Free shipping on orders ≥ ${m[1]}`;
  m = teks.match(/^Hari ini (.+)$/);
  if (m) return `Today ${m[1]}`;
  m = teks.match(/^Besok (.+)$/);
  if (m) return `Tomorrow ${m[1]}`;
  m = teks.match(/^Estimasi (.+?) menit setelah dikonfirmasi$/);
  if (m) return `Est. ${m[1]} minutes after confirmation`;
  m = teks.match(/^Dibuat (.+) · atas nama (.+)$/);
  if (m) return `Created ${m[1]} · for ${m[2]}`;
  m = teks.match(/^Status terakhir diperbarui (.+) · (.+)$/);
  if (m) return `Last updated ${m[1]} · ${terjemahkan(m[2], "en")}`;
  m = teks.match(/^Lokasi GPS aktif · (.+)$/);
  if (m) return `GPS active · ${terjemahkan(m[1], "en")}`;
  m = teks.match(/^Stok (.+) tersisa (\d+)\.$/);
  if (m) return `Only ${m[2]} left in stock for ${m[1]}.`;
  m = teks.match(/^Keranjang, (\d+) produk$/);
  if (m) return `Cart, ${m[1]} items`;
  m = teks.match(/^Lihat (.+)$/);
  if (m) return `View ${m[1]}`;
  m = teks.match(/^Hapus akun (.+)$/);
  if (m) return `Delete account ${m[1]}`;
  m = teks.match(/^Hapus kurir (.+)$/);
  if (m) return `Delete courier ${m[1]}`;
  m = teks.match(/^Hapus rekening (.+)$/);
  if (m) return `Delete account ${m[1]}`;
  m = teks.match(/^Nama bank rekening (\d+)$/);
  if (m) return `Bank name ${m[1]}`;
  m = teks.match(/^Nomor rekening (\d+)$/);
  if (m) return `Account number ${m[1]}`;
  m = teks.match(/^Atas nama rekening (\d+)$/);
  if (m) return `Account holder name ${m[1]}`;
  m = teks.match(/^Pratinjau gambar QRIS toko$/);
  if (m) return "Store QRIS image preview";
  m = teks.match(/^Kode QRIS (.+)$/);
  if (m) return `QRIS code ${m[1]}`;
  m = teks.match(/^Hari sebelumnya$/);
  if (m) return "Previous day";
  m = teks.match(/^baru saja$/);
  if (m) return "just now";
  m = teks.match(/^(\d+) menit lalu$/);
  if (m) return `${m[1]} minutes ago`;
  m = teks.match(/^(\d+) jam lalu$/);
  if (m) return `${m[1]} hours ago`;
  m = teks.match(/^(\d+) hari lalu$/);
  if (m) return `${m[1]} days ago`;
  m = teks.match(/^(\d{1,2}) ([A-Za-z]{3,9}) (\d{4}), (\d{1,2})\.(\d{2})$/);
  if (m && BULAN[m[2]]) return `${m[1]} ${BULAN[m[2]]} ${m[3]}, ${m[4]}:${m[5]}`;
  m = teks.match(/^(\d{1,2}) ([A-Za-z]{3,9}) (\d{4})$/);
  if (m && BULAN[m[2]]) return `${m[1]} ${BULAN[m[2]]} ${m[3]}`;
  m = teks.match(/^([A-Za-z]+), (\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (m && HARI[m[1]] && BULAN[m[3]])
    return `${HARI[m[1]]}, ${m[2]} ${BULAN[m[3]]} ${m[4]}`;
  m = teks.match(/^([A-Za-z]+)$/);
  if (m && HARI[m[1]]) return HARI[m[1]];
  m = teks.match(/^([A-Za-z]+)$/);
  if (m && BULAN[m[1]]) return BULAN[m[1]];
  return undefined;
}

/** Terjemahkan potongan teks UI; spasi di awal/akhir tetap dipertahankan. */
export function terjemahkan(teks: string, lang: Lang): string {
  if (lang === "id") return teks;
  const cocok = teks.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!cocok) return teks;
  const [, depan, inti, belakang] = cocok;
  if (!inti) return teks;
  const hasil = KAMUS[inti] ?? aturan(inti);
  return hasil ? `${depan}${hasil}${belakang}` : teks;
}
