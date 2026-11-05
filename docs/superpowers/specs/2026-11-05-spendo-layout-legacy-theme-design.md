# Desain: Layout & Fungsi Template Spendo dengan Tema Ungu Lama

Tanggal: 2026-11-05
Status: disetujui user per bagian (struktur, warna/komponen, kalender/testing)

## Tujuan

Membuat tampilan, menu, dan fungsi [index.html](../../../index.html) mengikuti template Spendo
(referensi: `spendio.png` — dashboard donut, kartu tips, kartu kategori, nav 5 item,
halaman kalender), tetapi memakai palet warna tema lama (Vanilla terang / Cosmic gelap,
aksen ungu). Pendekatan yang dipilih: **A — perluas pola 3-pane swipe yang sudah ada
menjadi 4 pane**, tanpa mengubah format data.

## Keputusan scope

- Tiru penuh menu & fungsi template, **termasuk halaman Kalender baru**.
- Avatar dan lonceng notifikasi **tidak dibuat** (dekorasi template; app tidak punya akun/notifikasi).
- Kartu tips berisi teks dinamis sederhana dari data, **bukan** fitur wishlist/AI.
- Fitur existing yang wajib tetap berfungsi: tambah/edit/hapus transaksi via sheet, filter
  Semua/Masuk/Keluar, anggaran per kategori + progres, statistik bulanan, ekspor/Impor
  JSON/CSV, reset data, swipe antar halaman, PWA offline.

## Struktur halaman & navigasi

### Pane (track swipe)

Track diperluas dari 3 menjadi 4 pane (`width: 400%`, tiap pane 25%):

| Index | Pane | Isi |
|-------|------|-----|
| 0 | Home | Donut + kartu tips + kartu kategori + statistik + progres anggaran |
| 1 | Transaksi | Hero saldo, kartu pemasukan/pengeluaran, filter segmen, daftar transaksi per hari |
| 2 | Kalender | Grid bulan, daftar transaksi tanggal terpilih, total + bar kategori |
| 3 | Pengaturan | Tidak berubah (anggaran, cadangan data, reset) |

Halaman "Ringkasan" lama dilebur ke Home. Halaman default = Home (index 0).
`PAGES` berisi 4 entri; seluruh logika `setProgress`, `goTo`, `syncInert`, dan swipe
tetap memakai `PAGES.length` sehingga penyesuaian bersifat parameterisasi, bukan tulis ulang.
Semua referensi indeks pane hardcoded (misal `renderPane(0)` pada filter Transaksi dan
`renderPane(1)` saat menyimpan anggaran) disesuaikan dengan tabel di atas.

### Nav

Nav pill menjadi grid **5 kolom**: Home · Transaksi · **+** · Kalender · Pengaturan.

- Tombol **+** berada di kolom tengah, menonjol (lingkaran aksen ungu), dan memanggil
  `openSheet(null)` — bukan pane dan tidak punya state `aria-current`.
- Empat tab berada di kolom visual `[0, 1, 3, 4]`. Lens menempati lebar 1 kolom dan
  dipetakan ke kolom tersebut; animasi lens/blob/ripple dipertahankan.
- FAB mengambang yang lama **dihapus** (digantikan tombol + di nav).
- Setiap tab memakai ikon + label kecil; tab aktif memakai `aria-current="page"`.

### Header bulan

Mengikuti template: nama bulan besar di tengah (`monthLabel`), nama bulan sebelum dan
berikut tampil samar di kiri/kanan. Klik kiri/kanan = `shiftMonth(-1|1)`; klik tengah =
`goToCurrentMonth`. Aksesibilitas: ketiga elemen adalah button dengan aria-label
("Bulan sebelumnya", "Kembali ke bulan ini", "Bulan berikutnya").

## Warna & komponen visual

### Palet (kembali ke tema lama, dari commit `90ec629`)

- Light: `--bg:#FBF4E4`, `--text:#1E1638`, `--muted:#655C82`, `--accent:#5B3FD1`,
  `--accent-ink:#FFFFFF`, `--income:#15773A`, `--expense:#B4232C`, scrim `rgba(30,22,56,0.4)`.
- Dark: `--bg:#0B0A1F`, `--text:#F7EFD9`, `--muted:#A9A2CB`, `--accent:#A78BFA`,
  `--accent-ink:#140F33`, `--income:#6EE7A8`, `--expense:#FF8FA3`, scrim `rgba(0,0,0,0.6)`.
- Token pendukung (surface/field/edge/line/glow/shadow) diambil dari nilai lama yang
  setara, disesuaikan agar kartu tetap solid dan kontras teks AA pada kedua mode.
- Glassmorphism lama (blur transparan, bintang Cosmic) **tidak** dikembalikan; komponen
  tetap solid gaya template. Yang kembali hanya warna.

### Komponen Home

1. **Donut**: SVG existing, diperbesar, dengan label persen per kategori di sekeliling
   lingkaran (posisi dihitung dari sudut tengah segmen) dan total pengeluaran di tengah.
2. **Kartu tips**: satu kartu beraksen berisi teks dinamis:
   - Ada kategori melebihi anggaran → peringatan kategori tersebut.
   - Ada pengeluaran → kategori terbesar + persentasenya.
   - Belum ada data → ajakan mencatat dengan tombol +.
3. **Kartu kategori** (urut nominal terbesar): ikon bulat berwarna kategori, nama,
   tanggal transaksi terakhir kategori itu, total nominal. Jika anggaran diisi, bar
   progres + catatan sisa/melebihi anggaran tampil di dalam kartu yang sama.
4. **Statistik** "Gambaran bulan ini" (rata-rata harian, pengeluaran terbesar, sisa
   pemasukan) tetap tampil di bawah kartu kategori.

### Ikon kategori

Ikon SVG inline (stroke, 24px viewBox) untuk tiap kategori pengeluaran dan pemasukan:
makan, transport, kuliah, belanja, tagihan, hiburan, kesehatan, lain-lain, uang saku,
gaji, beasiswa, freelance. Warna latar bulatan mengikuti `cat.color`; ikon dipakai di
kartu Home dan baris Transaksi (menggantikan titik warna). Tidak ada aset eksternal.

### Sheet & Pengaturan

Bottom sheet tambah/edit transaksi dan halaman Pengaturan tidak berubah secara fungsi;
hanya token warna mengikuti palet lama.

## Halaman Kalender

- Grid Senin–Minggu; hari di luar bulan aktif ditampilkan samar dan tidak bisa diketuk.
- Setiap tanggal dalam bulan aktif: nomor tanggal + maksimal 3 titik warna kategori
  pengeluaran hari itu (kategori berbeda, bukan per transaksi).
- State ephemeral `selectedDate` (tidak disimpan): default tanggal hari ini jika bulan
  aktif = bulan ini, selain itu tanggal 1. Berpindah bulan mereset `selectedDate`.
- Tanggal terpilih diberi lingkaran aksen + `aria-pressed="true"`.
- Di bawah grid: daftar transaksi tanggal terpilih (komponen baris yang sama dengan
  halaman Transaksi; klik membuka sheet edit/hapus). Hari tanpa transaksi menampilkan
  teks "Tidak ada transaksi".
- Di bawah daftar: total pengeluaran bulan + bar horizontal bertumpuk per kategori
  (lebar segmen proporsional terhadap total) dengan legenda warna + nama + nominal.
  Jika tidak ada pengeluaran, bar disembunyikan dan total menampilkan Rp 0.
- Tombol + di nav tetap membuka sheet dengan tanggal default existing (`defaultDate()`);
  tidak ada kopling ke `selectedDate` (YAGNI).

## Data flow & penyimpanan

- Semua pane membaca `monthTx()` dan `state.data` yang sama; tidak ada format data baru,
  tidak ada migrasi, `storageKey` tetap `catatan-keuangan-v1`.
- Tambah/edit/hapus (dari pane manapun) → `persist()` → `renderAll()` → toast existing.
- `shiftMonth`/`goToCurrentMonth` me-render ulang semua pane termasuk kalender.
- `selectedDate` hanya state UI; reload mengembalikannya ke default.

## Error & empty state

- Data korup ditangani `sanitizeTx()`/`sanitizeBudgets()` existing; `localStorage` penuh
  tetap memakai pesan toast existing.
- Bulan tanpa pengeluaran: Home menampilkan kartu kosong (bukan donut), kalender tetap
  tampil dengan total Rp 0 dan tanpa bar.
- Jumlah hari memakai `daysInMonth()` (termasuk Februari kabisat); offset hari pertama
  dihitung dari `Date` lokal.
- Nominal besar tetap memakai aturan perkecilan font existing pada hero.

## Perubahan PWA

- `index.html`: dua meta `theme-color` kembali ke `#FBF4E4` (light) dan `#0B0A1F` (dark).
- `manifest.webmanifest`: `background_color` `#FBF4E4`, `theme_color` `#5B3FD1`.
- Ikon app kembali ke gaya lama: gradasi ungu `#1B1247 → #5B3FD1`, teks "Rp" krem
  `#FBF4E4`; maskable tetap dengan skala aman. Empat file PNG dibuat ulang.
- `sw.js`: `CACHE_NAME` naik ke `catatan-keuangan-v3`; daftar app-shell tidak berubah.
- README diperbarui seperlunya (struktur halaman baru).

## Pengujian

Lokal via server statis + browser automation, viewport mobile:

1. Screenshot light & dark untuk Home, Transaksi, Kalender, Pengaturan, dan sheet.
2. Tambah transaksi (muncul di Transaksi, Home, Kalender), edit, hapus + konfirmasi.
3. Pindah bulan maju/mundur termasuk Februari; ketuk tanggal dengan dan tanpa transaksi.
4. Filter Semua/Masuk/Keluar; isi anggaran dan lihat progres + tips berubah.
5. Ekspor JSON/CSV, impor JSON; reset data dengan konfirmasi.
6. Reload → data tetap ada; `selectedDate` kembali default.
7. Console bersih; SW `v3` aktif; semua aset 200.
8. Setelah commit/push: verifikasi produksi (konten baru live, ikon 200, SW v3).

## Di luar scope

- Avatar, notifikasi, wishlist, sinkronisasi cloud, multi-akun.
- Mengubah format data, menambah dependensi/build step, atau mengembalikan glassmorphism.
