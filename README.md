# 💰 Catatan Keuangan

Aplikasi pencatat keuangan pribadi berbasis web yang ringan, cantik, dan bisa langsung dipakai tanpa instalasi. Cocok untuk mahasiswa, freelancer, atau siapa saja yang ingin memantau pemasukan dan pengeluaran sehari-hari.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Single File](https://img.shields.io/badge/Single_File-0%20Dependencies-4CAF50?style=flat)
![Offline](https://img.shields.io/badge/100%25-Offline-blue?style=flat)

## ✨ Fitur Utama

- **Catat Transaksi** — Tambah pemasukan dan pengeluaran dengan kategori, tanggal, dan catatan
- **Ringkasan Visual** — Donut chart interaktif untuk melihat distribusi pengeluaran per kategori
- **Anggaran Bulanan** — Atur batas pengeluaran per kategori dan pantau progresnya
- **Navigasi Gestur** — Geser antar halaman dengan animasi fluid ala native app
- **Dark & Light Mode** — Otomatis mengikuti preferensi sistem (tema Vanilla & Cosmic)
- **Responsif Mobile** — Dioptimalkan untuk penggunaan di smartphone, mendukung PWA-style
- **Ekspor & Impor Data** — Cadangkan data ke JSON atau CSV, dan impor kembali kapan saja
- **Tanpa Server** — Semua data tersimpan di `localStorage` browser, 100% offline

## 🎨 Desain

Aplikasi ini menggunakan pendekatan **glassmorphism** dengan efek blur, transparansi, dan animasi halus:

- Navigasi bawah dengan efek lensa kaca bergerak
- Efek parallax dan ripple saat menggeser halaman
- Animasi micro-interaction pada tombol dan elemen interaktif
- Palet warna yang harmonis untuk tema terang (Vanilla) dan gelap (Cosmic)

## 📂 Struktur Proyek

```
Pencatat Keuangan/
├── Pencatat keuangan.html   # Seluruh aplikasi (HTML + CSS + JS)
└── README.md                # Dokumentasi
```

Proyek ini adalah **single-file application** — semua kode HTML, CSS, dan JavaScript tergabung dalam satu file tanpa dependensi eksternal.

## 🚀 How to use

1. **Buka langsung di browser**
   ```
   Klik dua kali file "Pencatat keuangan.html"
   ```
   Atau buka di browser favorit Anda (Chrome, Firefox, Safari, Edge).

2. **Atau deploy ke hosting statis**
   Upload file HTML ke GitHub Pages, Netlify, Vercel, atau hosting lainnya.

## 📖 how to use 

### Menambah Transaksi
1. Tekan tombol **+** (FAB) di pojok kanan bawah
2. Pilih jenis: **Pengeluaran** atau **Pemasukan**
3. Masukkan nominal, pilih kategori, tanggal, dan catatan (opsional)
4. Tekan **Simpan**

### Melihat Ringkasan
- Geser ke halaman **Ringkasan** untuk melihat donut chart pengeluaran
- Lihat statistik: rata-rata harian, pengeluaran terbesar, dan sisa dari pemasukan

### Mengatur Anggaran
1. Geser ke halaman **Pengaturan**
2. Isi batas anggaran per kategori pengeluaran
3. Progres anggaran akan muncul di halaman Ringkasan

### Navigasi Bulan
- Gunakan tombol **◀ ▶** di bagian atas untuk berpindah bulan
- Tekan nama bulan untuk kembali ke bulan ini

### Ekspor & Impor
- **Ekspor JSON** — Cadangkan seluruh data (bisa diimpor kembali)
- **Ekspor CSV** — Untuk dibuka di Excel/Google Sheets
- **Impor JSON** — Pulihkan data dari file cadangan

## 📊 Kategori Bawaan

### Pengeluaran
| Kategori | Warna |
|---|---|
| 🍽️ Makan dan minum | Kuning |
| 🚗 Transportasi | Biru |
| 🎓 Kuliah | Ungu |
| 🛒 Belanja | Pink |
| 📱 Tagihan dan pulsa | Teal |
| 🎮 Hiburan | Oranye |
| 💊 Kesehatan | Hijau |
| 📦 Lainnya | Abu-abu |

### Pemasukan
| Kategori |
|---|
| 💵 Uang saku |
| 💼 Gaji |
| 🎓 Beasiswa |
| 💻 Freelance |
| 📦 Lainnya |

## 🛠️ Teknologi

Aplikasi ini dibangun dengan arsitektur **single-file application** — seluruh markup, styling, dan logic dikemas dalam satu file HTML tanpa dependensi eksternal, sehingga dapat dijalankan langsung di browser manapun tanpa proses build.

| Teknologi | Implementasi |
|---|---|
| **HTML5** | Struktur semantik dengan atribut ARIA untuk aksesibilitas |
| **CSS3** | Inline `<style>` — CSS custom properties, glassmorphism, media queries, dan keyframe animations |
| **Vanilla JavaScript** | Inline `<script>` — DOM manipulation, state management, dan gesture handling tanpa framework |
| **Web Storage API** | Persistensi data lokal melalui `localStorage` |
| **Web Share API** | Native sharing untuk ekspor data pada perangkat yang mendukung |

## ⚠️ Catatan Penting

- Data tersimpan **hanya di browser ini**. Jika Anda menghapus data browser, transaksi akan hilang.
- Lakukan **ekspor berkala** untuk mencadangkan data Anda.
- Aplikasi berjalan sepenuhnya **offline** — tidak memerlukan koneksi internet.

## 📄 Lisensi

Proyek ini bersifat open-source. Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan.
