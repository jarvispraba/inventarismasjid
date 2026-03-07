# 🕌 Sistem Inventaris Masjid

Website inventaris barang masjid yang sederhana, mudah digunakan, dan terhubung langsung dengan Google Spreadsheet sebagai database.

## ✨ Fitur

- 📊 Dashboard dengan ringkasan data (Total Barang, Kondisi Baik, Perlu Perbaikan, Rusak)
- ➕ Form tambah barang yang mudah digunakan
- 📋 Tabel data inventaris dengan fitur search dan filter
- ✏️ Edit dan hapus data
- 📥 Export data ke CSV
- 📊 Tombol langsung ke Google Spreadsheet
- 🔄 Refresh data real-time
- 📱 Responsive dan mobile-friendly

## 📊 Struktur Data

Setiap barang memiliki 8 kolom (A-H):

| Kolom | Nama Kolom | Contoh |
|-------|------------|--------|
| A | ID Barang | BRG-001 |
| B | Nama Barang | Speaker Aktif |
| C | Kategori | Alat Sound |
| D | Sub Kategori | Speaker |
| E | Jumlah | 2 |
| F | Kondisi | Baik / Perlu Perbaikan / Rusak |
| G | Status | Tersedia / Perbaikan / Tidak Ada |
| H | Lokasi | Ruang Sound |

## 🚀 Cara Setup

### 1. Setup Google Spreadsheet

1. Buat spreadsheet baru di [Google Spreadsheet](https://sheets.google.com)
2. Beri nama sheet: **Inventaris**
3. Buat header di baris pertama (kolom A-H):
   ```
   ID Barang | Nama Barang | Kategori | Sub Kategori | Jumlah | Kondisi | Status | Lokasi
   ```
4. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_DISINI/edit
   ```

### 2. Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Klik **New Project**
3. Copy semua kode dari file `google-apps-script.js`
4. Paste ke editor Apps Script
5. **Ganti SPREADSHEET_ID** di baris 8:
   ```javascript
   const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
   ```
6. Save (Ctrl+S)

### 3. Deploy Apps Script

1. Klik **Deploy** > **New deployment**
2. Klik icon ⚙️ > Pilih type: **Web app**
3. Konfigurasi:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**
5. **Authorize access** (klik Review Permissions > Allow)
6. Copy **Web App URL**

### 4. Setup Website

1. Buka file `script.js`
2. Ganti `API_URL` di baris 5:
   ```javascript
   const API_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
   ```
3. Ganti `SPREADSHEET_ID` di baris 8:
   ```javascript
   const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
   ```
4. Save file

### 5. Jalankan Website

1. Buka `index.html` di browser
2. Data akan otomatis dimuat dari Google Spreadsheet
3. Mulai gunakan sistem inventaris!

## 📖 Cara Penggunaan

### Dashboard
- Lihat ringkasan total barang dan kondisinya
- Data diambil langsung dari Google Spreadsheet

### Tambah Barang
1. Klik menu **➕ Tambah Barang**
2. Isi semua field yang wajib (bertanda *)
3. Klik **💾 Simpan Data**
4. Data otomatis tersimpan ke Google Spreadsheet

### Data Inventaris
1. Klik menu **📋 Data Inventaris**
2. Gunakan search box untuk mencari barang
3. Gunakan filter kondisi untuk menyaring data
4. Klik **✏️ Edit** untuk mengubah data
5. Klik **🗑️ Hapus** untuk menghapus data
6. Klik **📥 Export CSV** untuk download data
7. Klik **📊 Buka Google Spreadsheet** untuk lihat spreadsheet
8. Klik **🔄 Refresh Data** untuk reload data terbaru

## 🔧 Troubleshooting

### Data tidak muncul
- Pastikan `API_URL` di `script.js` sudah benar
- Pastikan Apps Script sudah di-deploy dengan akses "Anyone"
- Buka Console browser (F12) untuk melihat error
- Pastikan spreadsheet memiliki sheet bernama "Inventaris"

### Error saat tambah/edit/hapus
- Pastikan `SPREADSHEET_ID` di Apps Script sudah benar
- Pastikan Apps Script memiliki permission untuk mengakses spreadsheet
- Cek apakah header spreadsheet sesuai (8 kolom: A-H)

### Test API Connection
- Buka file `test-api.html` di browser
- Paste Web App URL
- Test GET dan ADD request
- Lihat log untuk debugging

## 📱 Mobile Friendly

Website ini sudah responsive dan bisa digunakan di:
- Desktop/Laptop
- Tablet
- Smartphone

## 📄 Struktur File

```
inventaris-masjid/
├── index.html              # Halaman utama website
├── script.js               # JavaScript frontend
├── google-apps-script.js   # Backend API (deploy di Google Apps Script)
├── test-api.html          # Tool untuk test koneksi API
└── README.md              # Dokumentasi ini
```

## 💡 Tips

- ID Barang harus unik (tidak boleh sama)
- Gunakan format ID yang konsisten: BRG-001, BRG-002, dst
- Backup spreadsheet secara berkala
- Atur permission spreadsheet sesuai kebutuhan

## 🎨 Kustomisasi

### Ubah Warna Tema
Edit di `index.html`, ganti class Tailwind:
- `bg-green-600` → warna utama
- Ganti dengan: `bg-blue-600`, `bg-purple-600`, dll

### Tambah Kategori/Lokasi
Edit di `index.html`:
- Cari `<select id="kategori">` untuk tambah kategori
- Cari `<select id="lokasi">` untuk tambah lokasi

---

**Dibuat dengan ❤️ untuk kemudahan pengelolaan inventaris masjid**
