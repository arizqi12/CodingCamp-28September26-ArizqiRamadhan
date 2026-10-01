# Design — Expense & Budget Visualizer

## Arsitektur Aplikasi

Aplikasi ini adalah **Single-Page Application (SPA)** statis yang sepenuhnya berjalan di browser. Tidak ada server-side logic.

```
index.html          ← Struktur HTML dan pemuatan Chart.js (CDN)
css/style.css       ← Semua styling, termasuk layout, komponen, dan responsivitas
js/app.js           ← Seluruh logika aplikasi (state, storage, rendering, chart)
```

---

## Struktur Data (localStorage)

### `evb_expenses` — Array of Expense Objects
```json
[
  {
    "id": "uuid-v4-string",
    "description": "Makan siang",
    "amount": 35000,
    "category": "Makanan",
    "date": "2026-09-28"
  }
]
```

### `evb_budgets` — Object keyed by category name
```json
{
  "Makanan": 500000,
  "Transportasi": 300000,
  "Hiburan": 200000,
  "Kesehatan": 150000,
  "Pendidikan": 100000,
  "Lainnya": 100000
}
```

---

## Struktur HTML (`index.html`)

```
<body>
  <header>                    ← Judul aplikasi + filter bulan/tahun
  <main>
    <section#summary>         ← Kartu ringkasan (total, anggaran, sisa)
    <section#chart-section>   ← Canvas Chart.js + legend kategori
    <section#form-section>    ← Form tambah/edit pengeluaran
    <section#expenses-list>   ← Tabel daftar pengeluaran
    <section#budget-section>  ← Daftar anggaran per kategori + form set budget
  </main>
  <footer>                    ← Tombol Reset Data
```

---

## Arsitektur JavaScript (`js/app.js`)

Kode diorganisir menjadi **modul-modul logis** dalam satu file, menggunakan pola namespace sederhana:

### 1. `Storage` — Layer Persistensi
```js
Storage.getExpenses()       // baca dari localStorage
Storage.saveExpenses(arr)   // tulis ke localStorage
Storage.getBudgets()        // baca budgets
Storage.saveBudgets(obj)    // tulis budgets
Storage.clearAll()          // hapus semua data
```

### 2. `State` — State Aplikasi (In-Memory)
```js
State.expenses = []         // array semua pengeluaran
State.budgets = {}          // object budget per kategori
State.editingId = null      // ID pengeluaran yang sedang diedit
State.filterMonth = ""      // "YYYY-MM" untuk filter bulan aktif
State.categories = []       // daftar kategori (default + kustom)
```

### 3. `Utils` — Helper Fungsi
```js
Utils.generateId()          // UUID sederhana
Utils.formatCurrency(n)     // Intl.NumberFormat IDR
Utils.getCurrentMonth()     // "YYYY-MM" dari Date.now()
Utils.getFilteredExpenses() // filter expenses by State.filterMonth
Utils.getCategoryTotals()   // { category: totalAmount } dari filtered expenses
```

### 4. `ChartManager` — Manajemen Chart.js
```js
ChartManager.init()         // inisialisasi instance Chart.js
ChartManager.update()       // update data & re-render chart
ChartManager.destroy()      // cleanup saat reset
```

### 5. `Renderer` — Rendering DOM
```js
Renderer.renderSummary()        // update kartu ringkasan
Renderer.renderExpenseTable()   // render tabel pengeluaran
Renderer.renderBudgetList()     // render daftar budget per kategori
Renderer.renderCategoryOptions()// populate <select> kategori di form
Renderer.showFormError(msg)     // tampilkan pesan error validasi
Renderer.clearForm()            // kosongkan & reset form
```

### 6. `EventHandlers` — Penangan Event DOM
```js
EventHandlers.onAddExpense()    // submit form pengeluaran
EventHandlers.onDeleteExpense() // klik hapus di tabel
EventHandlers.onEditExpense()   // klik edit di tabel
EventHandlers.onSetBudget()     // submit form budget
EventHandlers.onAddCategory()   // tambah kategori kustom
EventHandlers.onFilterChange()  // ubah filter bulan/tahun
EventHandlers.onResetData()     // klik reset semua data
```

### 7. `App.init()` — Entry Point
```js
App.init() // load data dari storage → render semua komponen → pasang event listeners
```

---

## Alur Data Utama

```
User Action (form submit / klik)
        ↓
EventHandlers.on*()
        ↓
Validasi input → tampilkan error jika gagal
        ↓
Mutasi State (tambah/edit/hapus array)
        ↓
Storage.save*() → persisten ke localStorage
        ↓
Renderer.render*()  ← perbarui semua tampilan DOM
        ↓
ChartManager.update() ← perbarui pie chart
```

---

## Desain UI / Layout

### Palet Warna
| Peran | Warna |
|---|---|
| Primary | `#4F46E5` (indigo) |
| Success | `#10B981` (emerald) |
| Danger | `#EF4444` (red) |
| Warning | `#F59E0B` (amber) |
| Background | `#F9FAFB` (gray-50) |
| Card | `#FFFFFF` |
| Text utama | `#111827` |
| Text sekunder | `#6B7280` |

### Warna Kategori (digunakan di chart dan badge)
```
Makanan       → #FF6384
Transportasi  → #36A2EB
Hiburan       → #FFCE56
Kesehatan     → #4BC0C0
Pendidikan    → #9966FF
Lainnya       → #FF9F40
Kustom (n)    → warna dari palette dinamis
```

### Layout Desktop (≥768px)
```
┌─────────────────────────────────────────────────┐
│  HEADER: Judul + Filter Bulan                   │
├──────────────┬──────────────────────────────────┤
│  Summary     │  Pie Chart + Legend               │
│  Cards (3)   │                                   │
├──────────────┴──────────────────────────────────┤
│  Form Tambah/Edit Pengeluaran                    │
├─────────────────────────────────────────────────┤
│  Tabel Daftar Pengeluaran                        │
├─────────────────────────────────────────────────┤
│  Budget per Kategori (kartu grid)                │
└─────────────────────────────────────────────────┘
```

### Layout Mobile (<768px)
Semua section ditumpuk secara vertikal (single column). Chart ditampilkan lebih kecil.

---

## Validasi Form

| Field | Aturan Validasi |
|---|---|
| Deskripsi | Wajib diisi, maks 100 karakter |
| Jumlah | Wajib diisi, angka positif > 0 |
| Kategori | Wajib dipilih |
| Tanggal | Wajib diisi, tidak boleh di masa depan |
| Budget | Angka positif ≥ 0 |

---

## Edge Cases

- **Tidak ada pengeluaran**: Tabel menampilkan baris "Belum ada pengeluaran." Chart menampilkan pesan kosong.
- **Anggaran = 0**: Ditampilkan sebagai "Belum diatur", tidak memunculkan indikator merah.
- **Pengeluaran melebihi anggaran**: Teks sisa anggaran berwarna merah dengan ikon peringatan.
- **Filter bulan tanpa data**: Tabel kosong, chart kosong, ringkasan menampilkan Rp 0.
