# Requirements — Expense & Budget Visualizer

## Ringkasan Proyek

Aplikasi web single-page yang memungkinkan pengguna mencatat pengeluaran harian, menetapkan anggaran per kategori, dan memvisualisasikan distribusi pengeluaran melalui diagram lingkaran (pie chart) interaktif. Dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework; data disimpan di Local Storage; grafik dirender menggunakan Chart.js.

---

## Persyaratan Fungsional

### R1 — Manajemen Pengeluaran
- **R1.1** Pengguna dapat menambahkan entri pengeluaran baru dengan mengisi: nama/deskripsi, jumlah (angka positif), kategori, dan tanggal.
- **R1.2** Pengguna dapat menghapus entri pengeluaran yang sudah ada.
- **R1.3** Pengguna dapat mengedit entri pengeluaran yang sudah ada.
- **R1.4** Daftar pengeluaran ditampilkan dalam tabel yang dapat diurutkan berdasarkan tanggal (terbaru di atas secara default).
- **R1.5** Setiap baris tabel menampilkan: nama, jumlah (format Rupiah), kategori, tanggal, dan tombol aksi (edit / hapus).

### R2 — Manajemen Anggaran
- **R2.1** Pengguna dapat menetapkan batas anggaran bulanan per kategori.
- **R2.2** Sistem menyediakan kategori default: Makanan, Transportasi, Hiburan, Kesehatan, Pendidikan, Lainnya.
- **R2.3** Pengguna dapat menambahkan kategori kustom baru.
- **R2.4** Sisa anggaran per kategori ditampilkan (anggaran − total pengeluaran kategori bulan berjalan).
- **R2.5** Indikator visual (warna merah) muncul jika pengeluaran suatu kategori melebihi anggaran yang ditetapkan.

### R3 — Visualisasi Chart
- **R3.1** Diagram lingkaran (pie chart) ditampilkan menggunakan Chart.js yang menggambarkan proporsi pengeluaran per kategori untuk bulan berjalan.
- **R3.2** Chart diperbarui secara otomatis setiap kali ada penambahan, pengeditan, atau penghapusan pengeluaran.
- **R3.3** Setiap segmen chart memiliki warna unik yang konsisten dengan warna kategori di seluruh UI.
- **R3.4** Tooltip pada chart menampilkan nama kategori, total pengeluaran, dan persentase dari keseluruhan.
- **R3.5** Jika tidak ada data pengeluaran, chart menampilkan pesan "Belum ada data pengeluaran".

### R4 — Ringkasan & Statistik
- **R4.1** Panel ringkasan menampilkan: total pengeluaran bulan ini, total anggaran bulan ini, dan sisa anggaran keseluruhan.
- **R4.2** Progress bar keseluruhan menampilkan persentase penggunaan anggaran total.
- **R4.3** Pengguna dapat memfilter tampilan daftar dan chart berdasarkan bulan/tahun.

### R5 — Persistensi Data
- **R5.1** Semua data pengeluaran disimpan di `localStorage` dengan key `evb_expenses`.
- **R5.2** Semua data anggaran disimpan di `localStorage` dengan key `evb_budgets`.
- **R5.3** Data dimuat otomatis saat aplikasi dibuka sehingga tidak ada kehilangan data saat halaman di-refresh.
- **R5.4** Pengguna dapat mereset/menghapus semua data dengan konfirmasi dialog.

---

## Persyaratan Non-Fungsional

- **NF1** Aplikasi harus berjalan sepenuhnya di browser tanpa backend (static HTML).
- **NF2** Tidak boleh menggunakan framework JS (React, Vue, Angular) maupun CSS framework (Bootstrap, Tailwind).
- **NF3** Chart.js dimuat via CDN.
- **NF4** UI responsif dan dapat digunakan di layar desktop (≥768px) maupun mobile.
- **NF5** Validasi form dilakukan di sisi klien sebelum data disimpan; pesan error ditampilkan di dekat field yang bermasalah.
- **NF6** Format mata uang menggunakan Rupiah (IDR) dengan `Intl.NumberFormat`.
- **NF7** Kode JavaScript ditulis dalam satu file (`js/app.js`) dengan modul/fungsi terorganisir dan komentar yang memadai.

---

## Batasan Scope (MVP)

- Tidak ada autentikasi/login.
- Tidak ada sinkronisasi cloud; semua data lokal.
- Tidak ada laporan ekspor (PDF/Excel) pada versi MVP.
- Tidak ada peramalan/prediksi anggaran.
