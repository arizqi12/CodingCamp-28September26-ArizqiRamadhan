# Tasks — Expense & Budget Visualizer

Urutan tugas mengikuti alur bottom-up: struktur HTML dulu, lalu logika JS layer per layer, lalu styling, terakhir integrasi dan polish.

---

## Task 1 — Scaffold HTML (`index.html`)

Buat kerangka HTML lengkap yang mencakup semua section UI.

**Acceptance criteria:**

- [x] Terdapat `<header>` dengan judul aplikasi dan `<input type="month">` untuk filter bulan.
- [x] Terdapat section `#summary` dengan tiga kartu: Total Pengeluaran, Total Anggaran, Sisa Anggaran — masing-masing memiliki `<span>` dengan ID unik untuk diisi oleh JS.
- [x] Terdapat section `#chart-section` dengan `<canvas id="expenseChart">` dan `<p id="chart-empty-msg">` untuk pesan kosong.
- [x] Terdapat section `#form-section` dengan form (`id="expense-form"`) berisi field: deskripsi (`#desc`), jumlah (`#amount`), kategori (`#category`), tanggal (`#date`), tombol Submit, tombol Batal (awalnya hidden), dan `<p id="form-error">` untuk pesan error.
- [x] Terdapat section `#expenses-list` dengan `<table>` yang memiliki `<thead>` statis dan `<tbody id="expense-tbody">` kosong.
- [x] Terdapat section `#budget-section` dengan `<div id="budget-cards">` dan form kecil untuk set budget per kategori (`id="budget-form"`), termasuk input kategori kustom.
- [x] Chart.js dimuat via CDN sebelum `js/app.js` di bagian bawah `<body>`.
- [x] Semua elemen memiliki `id` atau `class` yang konsisten dengan yang direferensikan di `design.md`.

**File yang diubah:** `index.html`

---

## Task 2 — Layer Storage & State (`js/app.js` — bagian 1)

Implementasikan modul `Storage` dan `State` sebagai fondasi data.

**Acceptance criteria:**

- [ ] `Storage.getExpenses()` membaca dan mem-parse JSON dari `localStorage['evb_expenses']`; mengembalikan `[]` jika key tidak ada.
- [~] `Storage.saveExpenses(arr)` menulis array ke `localStorage['evb_expenses']` sebagai JSON string.
- [~] `Storage.getBudgets()` membaca `localStorage['evb_budgets']`; mengembalikan object dengan 6 kategori default bernilai `0` jika key tidak ada.
- [~] `Storage.saveBudgets(obj)` menulis object ke `localStorage['evb_budgets']`.
- [~] `Storage.clearAll()` menghapus kedua key dari localStorage.
- [~] `State` mencakup: `expenses`, `budgets`, `editingId`, `filterMonth`, `categories` (dengan 6 default).
- [~] Tidak ada dependensi ke DOM; modul ini murni logika data.

**File yang diubah:** `js/app.js`

---

## Task 3 — Layer Utils (`js/app.js` — bagian 2)

Implementasikan fungsi-fungsi helper yang digunakan oleh seluruh modul lain.

**Acceptance criteria:**

- [~] `Utils.generateId()` mengembalikan string unik (minimal menggunakan `Date.now()` + `Math.random()`).
- [~] `Utils.formatCurrency(n)` mengembalikan string format Rupiah (contoh: `"Rp 35.000"`), menggunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
- [~] `Utils.getCurrentMonth()` mengembalikan string `"YYYY-MM"` berdasarkan tanggal hari ini.
- [~] `Utils.getFilteredExpenses()` mengembalikan subset `State.expenses` yang `date` -nya cocok dengan `State.filterMonth` (format `"YYYY-MM"`); jika `filterMonth` kosong, kembalikan semua.
- [~] `Utils.getCategoryTotals()` mengembalikan object `{ kategori: total }` dari hasil `getFilteredExpenses()`.

**File yang diubah:** `js/app.js`

---

## Task 4 — Renderer DOM (`js/app.js` — bagian 3)

Implementasikan semua fungsi rendering yang memperbarui tampilan HTML.

**Acceptance criteria:**

- [~] `Renderer.renderSummary()` mengisi `#total-expense`, `#total-budget`, `#remaining-budget` dengan nilai dari `Utils` yang diformat sebagai Rupiah; progress bar `#budget-progress` diperbarui dengan persentase yang tepat (max 100%).
- [~] `Renderer.renderExpenseTable()` mengosongkan `#expense-tbody` lalu mengisinya dengan baris tabel; setiap baris memiliki tombol Edit (`data-id`) dan Hapus (`data-id`).
- [~] `Renderer.renderBudgetList()` mengisi `#budget-cards` dengan kartu per kategori yang menampilkan: nama kategori, anggaran (atau "Belum diatur"), total pengeluaran bulan ini, dan sisa; kartu berwarna merah jika over-budget.
- [~] `Renderer.renderCategoryOptions()` mengisi `<select id="category">` dengan semua kategori di `State.categories`.
- [~] `Renderer.showFormError(msg)` menampilkan `msg` di `#form-error`; `Renderer.clearFormError()` menyembunyikannya.
- [~] `Renderer.clearForm()` mereset semua field form ke nilai default; menyembunyikan tombol Batal; mengembalikan teks tombol Submit ke "Tambah Pengeluaran".
- [~] `Renderer.renderAll()` memanggil semua fungsi render di atas sekaligus.

**File yang diubah:** `js/app.js`

---

## Task 5 — ChartManager (`js/app.js` — bagian 4)

Implementasikan integrasi Chart.js untuk pie chart.

**Acceptance criteria:**

- [~] `ChartManager.init()` membuat instance `new Chart()` pada `<canvas id="expenseChart">` dengan tipe `'doughnut'` (atau `'pie'`).
- [~] `ChartManager.update()` mengambil data dari `Utils.getCategoryTotals()`, memperbarui `chart.data.labels` dan `chart.data.datasets[0].data`, lalu memanggil `chart.update()`.
- [~] Warna per kategori diambil dari palet warna yang didefinisikan di `design.md` (konsisten).
- [~] Jika tidak ada data (semua kategori = 0 atau array kosong), chart dirender dengan data kosong dan elemen `#chart-empty-msg` ditampilkan; sebaliknya, disembunyikan.
- [~] Tooltip menampilkan format: `"Makanan: Rp 150.000 (45%)"`.
- [~] `ChartManager.destroy()` memanggil `chart.destroy()` untuk cleanup.

**File yang diubah:** `js/app.js`

---

## Task 6 — EventHandlers & App.init() (`js/app.js` — bagian 5)

Sambungkan semua komponen dan pasang event listener.

**Acceptance criteria:**

- [~] `EventHandlers.onAddExpense(e)`: validasi form → buat objek expense baru dengan `Utils.generateId()` → push ke `State.expenses` → `Storage.saveExpenses()` → `Renderer.renderAll()` → `ChartManager.update()` → `Renderer.clearForm()`.
- [~] Jika `State.editingId !== null`, mode edit aktif: temukan expense dengan ID tersebut, update propertinya, reset `editingId` ke `null`.
- [~] `EventHandlers.onDeleteExpense(id)`: konfirmasi `window.confirm()` → filter keluar dari `State.expenses` → save → render.
- [~] `EventHandlers.onEditExpense(id)`: temukan expense → isi form dengan datanya → set `State.editingId` → ubah teks tombol Submit menjadi "Simpan Perubahan" → tampilkan tombol Batal.
- [~] `EventHandlers.onSetBudget(e)`: baca nilai budget per kategori dari form → update `State.budgets` → `Storage.saveBudgets()` → `Renderer.renderBudgetList()` → `ChartManager.update()`.
- [~] `EventHandlers.onAddCategory()`: validasi nama tidak kosong dan belum ada → push ke `State.categories` → `Renderer.renderCategoryOptions()` → perbarui form budget.
- [~] `EventHandlers.onFilterChange(e)`: set `State.filterMonth = e.target.value` → `Renderer.renderAll()` → `ChartManager.update()`.
- [~] `EventHandlers.onResetData()`: `window.confirm()` → `Storage.clearAll()` → reset `State` → `Renderer.renderAll()` → `ChartManager.update()`.
- [~] `App.init()`: load dari `Storage` ke `State` → set `State.filterMonth` ke bulan saat ini → `ChartManager.init()` → `Renderer.renderAll()` → pasang semua event listener.
- [~] `App.init()` dipanggil di akhir file dengan `document.addEventListener('DOMContentLoaded', App.init)`.

**File yang diubah:** `js/app.js`

---

## Task 7 — Styling Lengkap (`css/style.css`)

Implementasikan semua styling sesuai palet warna dan layout yang didefinisikan di `design.md`.

**Acceptance criteria:**

- [~] CSS reset/base: `box-sizing: border-box`, font stack sans-serif, background `#F9FAFB`.
- [~] Header: background primary `#4F46E5`, teks putih, layout flex antara judul dan filter.
- [~] Summary cards: grid 3 kolom di desktop, 1 kolom di mobile; setiap kartu memiliki shadow dan border-radius.
- [~] Chart section: canvas dibatasi max-width 400px, di-center.
- [~] Form: input dan select memiliki border, padding, dan focus style yang konsisten; tombol Submit berwarna primary; tombol Batal berwarna abu-abu.
- [~] Tabel: header berwarna primary (teks putih), baris bergantian (striped), hover effect; tombol Edit (warna warning) dan Hapus (warna danger) berukuran kecil.
- [~] Budget cards: grid 2–3 kolom; kartu dengan indikator over-budget memiliki border merah dan background merah muda.
- [~] Progress bar: bar berwarna success (`#10B981`), berubah ke danger (`#EF4444`) jika > 90%.
- [~] Responsif: semua grid menjadi single column di layar < 768px.
- [~] Pesan error form: teks merah kecil, visible hanya ketika ada error.

**File yang diubah:** `css/style.css`

---

## Task 8 — Integrasi, Validasi & Polish

Lakukan integrasi akhir, pastikan semua alur kerja berfungsi end-to-end, dan tambahkan sentuhan UX terakhir.

**Acceptance criteria:**

- [~] Alur lengkap **Tambah pengeluaran** berjalan: isi form → submit → muncul di tabel → chart diperbarui → ringkasan diperbarui → data ada di localStorage setelah refresh.
- [~] Alur lengkap **Edit pengeluaran** berjalan: klik Edit → form terisi → ubah nilai → simpan → tabel dan chart diperbarui.
- [~] Alur lengkap **Hapus pengeluaran** berjalan: klik Hapus → konfirmasi → baris hilang → chart diperbarui.
- [~] Alur lengkap **Set budget** berjalan: isi nilai budget per kategori → simpan → kartu budget diperbarui → indikator merah muncul jika over-budget.
- [~] **Filter bulan** berfungsi: ganti bulan → tabel, chart, dan ringkasan hanya menampilkan data bulan tersebut.
- [~] **Reset data** berfungsi: konfirmasi → semua data terhapus → UI kembali ke kondisi kosong.
- [~] Validasi form menolak: deskripsi kosong, jumlah ≤ 0, tanggal tidak diisi.
- [~] Tidak ada error di browser console pada alur-alur di atas.
- [~] Tampilan rapi di lebar 375px (mobile) dan 1280px (desktop).

**File yang diubah:** `index.html`, `css/style.css`, `js/app.js`
