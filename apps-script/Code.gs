/**
 * Yanti Frozen — backend Google Sheets (JSON API lewat GET).
 *
 * Cara pakai singkat:
 * 1. Buat Google Spreadsheet baru.
 * 2. Extensions → Apps Script, tempel seluruh file ini.
 * 3. Isi KUNCI di bawah dengan kalimat acak panjang (sama dengan GOOGLE_SHEETS_KEY).
 * 4. Isi ID_SPREADSHEET dengan ID spreadsheet Anda (lihat URL).
 * 5. Jalankan fungsi setup() satu kali (pilih di editor → Run) dan izinkan akses.
 * 6. Deploy → New deployment → Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 *    Salin URL /exec → GOOGLE_SHEETS_URL di Vercel.
 *
 * Catatan: aplikasi hanya memakai GET karena Web App Apps Script
 * mengalihkan POST (302) dan membuang body permintaan.
 */

var KUNCI = "ganti-kunci-rahasia-panjang";
var ID_SPREADSHEET = "1bBqUXFwxlqM3bSh4RxwkzW97AOO7fIyWXfo7-i6Djos";

var NAMA_SHEET = "Settings";
var HEADER_SETTINGS = ["kunci", "nilai"];

/** Definisi tabel + tipe kolom: s=teks, n=angka, b=boolean, t=boolean default true, m=angka/null. */
var TABEL = {
  Users: {
    kolom: [
      ["id", "s"],
      ["nama", "s"],
      ["telepon", "s"],
      ["alamat", "s"],
      ["dibuat", "s"],
    ],
  },
  Products: {
    kolom: [
      ["id", "s"],
      ["nama", "s"],
      ["slug", "s"],
      ["kategori", "s"],
      ["harga", "n"],
      ["hargaPromo", "m"],
      ["satuan", "s"],
      ["stok", "n"],
      ["deskripsi", "s"],
      ["gambar", "s"],
      ["unggulan", "b"],
      ["aktif", "b"],
      ["dibuat", "s"],
    ],
  },
  Orders: {
    kolom: [
      ["id", "s"],
      ["kode", "s"],
      ["userId", "s"],
      ["pelanggan", "s"],
      ["telepon", "s"],
      ["alamat", "s"],
      ["catatan", "s"],
      ["metode", "s"],
      ["pembayaran", "s"],
      ["dibayar", "b"],
      ["ongkir", "n"],
      ["subtotal", "n"],
      ["total", "n"],
      ["status", "s"],
      ["kurirId", "s"],
      ["jadwal", "s"],
      ["dibuat", "s"],
      ["diperbarui", "s"],
      ["lat", "m"],
      ["lng", "m"],
      ["bintang", "m"],
      ["ulasan", "s"],
    ],
  },
  OrderItems: {
    kolom: [
      ["id", "s"],
      ["orderId", "s"],
      ["produkId", "s"],
      ["nama", "s"],
      ["harga", "n"],
      ["jumlah", "n"],
      ["satuan", "s"],
      ["gambar", "s"],
    ],
  },
  Couriers: {
    kolom: [
      ["id", "s"],
      ["nama", "s"],
      ["telepon", "s"],
      ["sandi", "s"],
      ["kendaraan", "s"],
      ["status", "s"],
      ["online", "b"],
      ["rating", "n"],
      ["aktif", "t"],
    ],
  },
  Staff: {
    kolom: [
      ["id", "s"],
      ["nama", "s"],
      ["peran", "s"],
      ["telepon", "s"],
      ["sandi", "s"],
      ["aktif", "t"],
      ["dibuat", "s"],
    ],
  },
  Bugs: {
    kolom: [
      ["id", "s"],
      ["pesan", "s"],
      ["halaman", "s"],
      ["peran", "s"],
      ["status", "s"],
      ["dibuat", "s"],
      ["diperbarui", "s"],
    ],
  },
  Deliveries: {
    kolom: [
      ["id", "s"],
      ["orderId", "s"],
      ["kurirId", "s"],
      ["status", "s"],
      ["mulai", "s"],
      ["selesai", "s"],
      ["lat", "m"],
      ["lng", "m"],
      ["diperbarui", "s"],
      ["estimasiMenit", "n"],
    ],
  },
  Promotions: {
    kolom: [
      ["id", "s"],
      ["tipe", "s"],
      ["judul", "s"],
      ["deskripsi", "s"],
      ["badge", "s"],
      ["gambar", "s"],
      ["cta", "s"],
      ["aktif", "b"],
      ["mulai", "s"],
      ["selesai", "s"],
    ],
  },
};

var NUMERIK_SETTINGS = ["ongkir", "gratisOngkirMin", "estimasiAntar"];
var BOOLEAN_SETTINGS = ["tokoBuka"];
var ARRAY_SETTINGS = ["jadwalKirim"];

/** Versi API. Angka 2 menandakan cache + batch tersedia (dipakai aplikasi). */
var VERSI_API = 2;
var CACHE_NAMA = "jayanti-snap-v2";
var CACHE_DETIK = 90;
var CACHE_BAGIAN = 80000;

function doGet(e) {
  var parameter = (e && e.parameter) || {};
  try {
    if (String(parameter.key || "") !== String(KUNCI)) {
      return json({ ok: false, error: "Kunci akses salah." });
    }
    var aksi = String(parameter.action || "read");
    if (aksi === "read")
      return json({ ok: true, versi: VERSI_API, data: bacaSemua() });
    if (aksi === "upsert")
      return json(upsert(parameter.table, parameter.rows, true));
    if (aksi === "batch") return json(tulisBatch(parameter.data));
    if (aksi === "delete") return json(hapus(parameter.table, parameter.id));
    if (aksi === "settings") return json(tulisSettings(parameter.value));
    if (aksi === "setup") {
      siapkanSemua();
      return json({ ok: true, pesan: "Semua sheet siap." });
    }
    return json({ ok: false, error: "Aksi tidak dikenal: " + aksi });
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) });
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function spreadsheet() {
  if (ID_SPREADSHEET) return SpreadsheetApp.openById(ID_SPREADSHEET);
  var aktif = SpreadsheetApp.getActiveSpreadsheet();
  if (!aktif) throw new Error("Spreadsheet tidak ditemukan. Isi ID_SPREADSHEET.");
  return aktif;
}

/** Jalankan sekali dari editor untuk membuat semua sheet + header. */
function setup() {
  siapkanSemua();
}

function siapkanSemua() {
  var file = spreadsheet();
  Object.keys(TABEL).forEach(function (nama) {
    siapkanSheet(file, nama, TABEL[nama].kolom.map(function (k) { return k[0]; }));
  });
  siapkanSheet(file, NAMA_SHEET, HEADER_SETTINGS);
}

function siapkanSheet(file, nama, header) {
  var sheet = file.getSheetByName(nama);
  if (!sheet) sheet = file.insertSheet(nama);
  var lebar = header.length;
  var sekarang = sheet.getRange(1, 1, 1, lebar).getValues()[0];
  var sama =
    sekarang.join("|") === header.join("|") &&
    String(sheet.getRange(1, lebar + 1).getValue() || "") === "";
  if (!sama) {
    // Header lama (mis. kolom PIN) diganti agar urutan kolom tetap sejajar.
    sheet.getRange(1, 1, 1, Math.max(lebar, sheet.getLastColumn()))
      .clearContent();
    sheet.getRange(1, 1, 1, lebar).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function bacaSemua() {
  // Membaca 9 sheet sekaligus butuh 4-5 detik. Salinan singkat di cache
  // membuat permintaan berikutnya hampir instan; setiap penulisan
  // memperbarui salinan itu langsung.
  var tersimpan = bacaCache();
  if (tersimpan) return tersimpan;
  var file = spreadsheet();
  var data = {};
  Object.keys(TABEL).forEach(function (nama) {
    data[dekap(nama)] = bacaTabel(file, nama, TABEL[nama].kolom);
  });
  data.settings = bacaSettings(file);
  simpanCache(data);
  return data;
}

function bacaCache() {
  try {
    var cache = CacheService.getScriptCache();
    var jumlah = Number(cache.get(CACHE_NAMA + ":n")) || 0;
    if (!jumlah || jumlah > 90) return null;
    var kunci = [];
    for (var i = 0; i < jumlah; i++) kunci.push(CACHE_NAMA + ":" + i);
    var isi = cache.getAll(kunci);
    var teks = "";
    for (var j = 0; j < jumlah; j++) {
      var bagian = isi[CACHE_NAMA + ":" + j];
      if (bagian === null || bagian === undefined) return null;
      teks += bagian;
    }
    var data = JSON.parse(teks);
    return data && typeof data === "object" ? data : null;
  } catch (e) {
    return null;
  }
}

function simpanCache(data) {
  try {
    var teks = JSON.stringify(data);
    var jumlah = Math.max(1, Math.ceil(teks.length / CACHE_BAGIAN));
    if (jumlah > 90) return;
    var isi = {};
    for (var i = 0; i < jumlah; i++)
      isi[CACHE_NAMA + ":" + i] = teks.substr(i * CACHE_BAGIAN, CACHE_BAGIAN);
    var cache = CacheService.getScriptCache();
    cache.putAll(isi, CACHE_DETIK);
    cache.put(CACHE_NAMA + ":n", String(jumlah), CACHE_DETIK);
  } catch (e) {
    // Cache penuh atau dimatikan: data tetap tersimpan di Spreadsheet.
  }
}

/** Gabungkan baris yang baru ditulis ke salinan cache tanpa membaca ulang. */
function perbaruiCache(nama, rows, fields) {
  var data = bacaCache();
  if (!data) return;
  var daftar = data[nama] || [];
  var posisi = {};
  for (var i = 0; i < daftar.length; i++) posisi[String(daftar[i].id)] = i;
  for (var r = 0; r < rows.length; r++) {
    var baris = rows[r];
    var id = String((baris && baris.id) || "");
    if (!id) continue;
    if (posisi[id] !== undefined) {
      if (fields && fields.length) {
        var lama = daftar[posisi[id]];
        for (var f = 0; f < fields.length; f++) lama[fields[f]] = baris[fields[f]];
      } else {
        daftar[posisi[id]] = baris;
      }
    } else {
      daftar.push(baris);
      posisi[id] = daftar.length - 1;
    }
  }
  data[nama] = daftar;
  simpanCache(data);
}

function hapusDariCache(nama, id) {
  var data = bacaCache();
  if (!data) return;
  data[nama] = (data[nama] || []).filter(function (baris) {
    return String(baris.id) !== String(id);
  });
  simpanCache(data);
}

function dekap(nama) {
  if (nama === "Users") return "users";
  if (nama === "Products") return "products";
  if (nama === "Orders") return "orders";
  if (nama === "OrderItems") return "orderItems";
  if (nama === "Couriers") return "couriers";
  if (nama === "Deliveries") return "deliveries";
  if (nama === "Promotions") return "promotions";
  if (nama === "Staff") return "staff";
  if (nama === "Bugs") return "bugs";
  return nama.toLowerCase();
}

function bacaTabel(file, nama, kolom) {
  var sheet = siapkanSheet(file, nama, kolom.map(function (k) { return k[0]; }));
  var terakhir = sheet.getLastRow();
  if (terakhir < 2) return [];
  var nilai = sheet.getRange(2, 1, terakhir - 1, kolom.length).getValues();
  var hasil = [];
  for (var i = 0; i < nilai.length; i++) {
    var baris = nilai[i];
    if (!String(baris[0] || "").trim()) continue;
    var objek = {};
    for (var j = 0; j < kolom.length; j++) {
      objek[kolom[j][0]] = konversiBaca(baris[j], kolom[j][1]);
    }
    hasil.push(objek);
  }
  return hasil;
}

function konversiBaca(nilai, tipe) {
  if (tipe === "b") return nilai === true || nilai === "TRUE" || nilai === "true";
  if (tipe === "t") {
    if (nilai === "" || nilai === null || nilai === undefined) return true;
    return nilai === true || nilai === "TRUE" || nilai === "true";
  }
  if (tipe === "n") return Number(nilai) || 0;
  if (tipe === "m") {
    if (nilai === "" || nilai === null || nilai === undefined) return null;
    var angka = Number(nilai);
    return isNaN(angka) ? null : angka;
  }
  var teks = nilai === null || nilai === undefined ? "" : String(nilai);
  return teks.charAt(0) === "'" ? teks.slice(1) : teks;
}

function bacaSettings(file) {
  var sheet = siapkanSheet(file, NAMA_SHEET, HEADER_SETTINGS);
  var terakhir = sheet.getLastRow();
  var hasil = {};
  if (terakhir < 2) return hasil;
  var nilai = sheet.getRange(2, 1, terakhir - 1, 2).getValues();
  for (var i = 0; i < nilai.length; i++) {
    var kunci = String(nilai[i][0] || "").trim();
    if (!kunci) continue;
    var isi = nilai[i][1];
    if (NUMERIK_SETTINGS.indexOf(kunci) >= 0) {
      hasil[kunci] = Number(isi) || 0;
    } else if (BOOLEAN_SETTINGS.indexOf(kunci) >= 0) {
      hasil[kunci] = isi === true || String(isi).toLowerCase() === "true";
    } else if (ARRAY_SETTINGS.indexOf(kunci) >= 0) {
      var teksArray = konversiBaca(isi, "s");
      if (teksArray.charAt(0) === "[") {
        try {
          hasil[kunci] = JSON.parse(teksArray);
        } catch (e) {
          hasil[kunci] = [];
        }
      } else {
        hasil[kunci] = teksArray
          ? teksArray.split(/\r?\n/).filter(function (s) { return s.trim(); })
          : [];
      }
    } else {
      hasil[kunci] = konversiBaca(isi, "s");
    }
  }
  return hasil;
}

function upsert(namaTabel, rowsJson, pakaiCache) {
  var def = TABEL[namaTabel];
  if (!def) throw new Error("Tabel tidak dikenal: " + namaTabel);
  var rows = JSON.parse(rowsJson || "[]");
  if (!Array.isArray(rows)) throw new Error("Data rows harus berupa array.");
  if (!rows.length) return { ok: true, jumlah: 0 };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var file = spreadsheet();
    tulisTabel(file, namaTabel, def, rows, null);
    if (pakaiCache) perbaruiCache(dekap(namaTabel), rows, null);
    return { ok: true, jumlah: rows.length };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Satu permintaan untuk beberapa tabel sekaligus. Dipakai alur status
 * pesanan agar satu klik admin cukup satu perjalanan ke Apps Script.
 * data = { tables: { Orders: { rows: [...], fields: ["status"] }, ... } }
 */
function tulisBatch(dataJson) {
  var paket = JSON.parse(dataJson || "{}");
  var tables = (paket && paket.tables) || {};
  var namaTabel = Object.keys(tables);
  if (!namaTabel.length) return { ok: true, jumlah: 0 };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var file = spreadsheet();
    var hasil = {};
    namaTabel.forEach(function (nama) {
      var def = TABEL[nama];
      if (!def) return;
      var kiriman = tables[nama] || {};
      var rows = kiriman.rows || [];
      var fields = kiriman.fields || null;
      if (!rows.length) return;
      tulisTabel(file, nama, def, rows, fields);
      perbaruiCache(dekap(nama), rows, fields);
      hasil[nama] = rows.length;
    });
    return { ok: true, jumlah: hasil };
  } finally {
    lock.releaseLock();
  }
}

/** Tulis baris; bila fields diisi, hanya kolom itu yang ditimpa (baris lama aman). */
function tulisTabel(file, namaTabel, def, rows, fields) {
  var sheet = siapkanSheet(
    file,
    namaTabel,
    def.kolom.map(function (k) {
      return k[0];
    }),
  );
  var terakhir = sheet.getLastRow();
  var kunciKolom = def.kolom.map(function (k) {
    return k[0];
  });
  var idKolom = kunciKolom.indexOf("id") + 1;
  var lebar = def.kolom.length;

  var indeks = {};
  if (terakhir >= 2) {
    var ids = sheet.getRange(2, idKolom, terakhir - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      var id = String(ids[i][0] || "").trim();
      if (id) indeks[id] = i + 2;
    }
  }

  var baru = [];
  var parsial = fields && fields.length > 0;
  for (var r = 0; r < rows.length; r++) {
    var baris = rows[r] || {};
    var idBaris = String(baris.id || "").trim();
    if (!idBaris) continue;
    if (indeks[idBaris] > 0) {
      var posisi = indeks[idBaris];
      if (parsial) {
        var lama = sheet.getRange(posisi, 1, 1, lebar).getValues()[0];
        var gabung = {};
        for (var j = 0; j < lebar; j++)
          gabung[kunciKolom[j]] = konversiBaca(lama[j], def.kolom[j][1]);
        for (var f = 0; f < fields.length; f++) gabung[fields[f]] = baris[fields[f]];
        sheet.getRange(posisi, 1, 1, lebar).setValues([konversiTulis(gabung, def.kolom)]);
      } else {
        sheet.getRange(posisi, 1, 1, lebar).setValues([konversiTulis(baris, def.kolom)]);
      }
    } else if (!indeks[idBaris]) {
      baru.push(konversiTulis(baris, def.kolom));
      indeks[idBaris] = -1;
    }
  }

  if (baru.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, baru.length, lebar).setValues(baru);
  }
}

function konversiTulis(objek, kolom) {
  return kolom.map(function (k) {
    var nilai = objek[k[0]];
    if (k[1] === "b" || k[1] === "t") return Boolean(nilai) === true;
    if (k[1] === "n") {
      var angka = Number(nilai);
      return isNaN(angka) ? 0 : angka;
    }
    if (k[1] === "m") {
      if (nilai === null || nilai === undefined || nilai === "") return "";
      var isi = Number(nilai);
      return isNaN(isi) ? "" : isi;
    }
    var teks = nilai === null || nilai === undefined ? "" : String(nilai);
    // Cegah teks pengguna dieksekusi sebagai formula di Google Sheets.
    if (/^[=+\-@]/.test(teks)) teks = "'" + teks;
    return teks;
  });
}

function hapus(namaTabel, id) {
  var def = TABEL[namaTabel];
  if (!def) throw new Error("Tabel tidak dikenal: " + namaTabel);
  if (!id) throw new Error("ID wajib diisi.");

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var file = spreadsheet();
    var sheet = siapkanSheet(file, namaTabel, def.kolom.map(function (k) { return k[0]; }));
    var terakhir = sheet.getLastRow();
    if (terakhir < 2) return { ok: true, dihapus: 0 };
    var ids = sheet.getRange(2, 1, terakhir - 1, 1).getValues();
    for (var i = ids.length - 1; i >= 0; i--) {
      if (String(ids[i][0] || "").trim() === String(id)) {
        sheet.deleteRow(i + 2);
        hapusDariCache(dekap(namaTabel), id);
        return { ok: true, dihapus: 1 };
      }
    }
    return { ok: true, dihapus: 0 };
  } finally {
    lock.releaseLock();
  }
}

function tulisSettings(valueJson) {
  var nilai = JSON.parse(valueJson || "{}");
  if (!nilai || typeof nilai !== "object") throw new Error("Settings tidak valid.");

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var file = spreadsheet();
    var sheet = siapkanSheet(file, NAMA_SHEET, HEADER_SETTINGS);
    var terakhir = sheet.getLastRow();
    var posisi = {};
    if (terakhir >= 2) {
      var rows = sheet.getRange(2, 1, terakhir - 1, 1).getValues();
      for (var i = 0; i < rows.length; i++) {
        var nama = String(rows[i][0] || "").trim();
        if (nama) posisi[nama] = i + 2;
      }
    }
    var baru = [];
    Object.keys(nilai).forEach(function (kunci) {
      var isi = nilai[kunci];
      var teks;
      if (ARRAY_SETTINGS.indexOf(kunci) >= 0) {
        teks = JSON.stringify(Array.isArray(isi) ? isi : []);
      } else if (BOOLEAN_SETTINGS.indexOf(kunci) >= 0) {
        teks = isi === true || String(isi).toLowerCase() === "true" ? "true" : "false";
      } else {
        teks = isi === null || isi === undefined ? "" : String(isi);
      }
      if (posisi[kunci]) {
        sheet.getRange(posisi[kunci], 2).setValue(teks);
      } else {
        baru.push([kunci, teks]);
      }
    });
    if (baru.length) {
      sheet.getRange(sheet.getLastRow() + 1, 1, baru.length, 2).setValues(baru);
    }
    var tersimpan = bacaCache();
    if (tersimpan) {
      tersimpan.settings = tersimpan.settings || {};
      Object.keys(nilai).forEach(function (kunci) {
        tersimpan.settings[kunci] = nilai[kunci];
      });
      simpanCache(tersimpan);
    }
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
