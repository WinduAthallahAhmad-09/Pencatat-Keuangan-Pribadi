# Spendo Layout + Tema Ungu Lama Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat tampilan, menu, dan fungsi index.html mengikuti template Spendo (4 pane, nav 5 item dengan + di tengah, halaman Kalender) dengan palet ungu tema lama, tanpa mengubah format data.

**Architecture:** Tetap satu file HTML/CSS/vanilla JS tanpa dependensi. Track swipe 3 pane diperluas jadi 4 pane; nav pill jadi grid 5 kolom dengan tombol + memanggil sheet existing; halaman Ringkasan lama menjadi Home dashboard; Kalender adalah pane baru yang membaca `monthTx()`.

**Tech Stack:** HTML/CSS/vanilla JS, localStorage, Web App Manifest, Service Worker, Node.js built-in `node:test` untuk unit test logika murni, agent-browser untuk E2E.

**Spec:** `docs/superpowers/specs/2026-11-05-spendo-layout-legacy-theme-design.md`

## Global Constraints

- Tanpa dependensi npm, tanpa build step; `storageKey` tetap `catatan-keuangan-v1`.
- Light: `--bg:#FBF4E4`, `--accent:#5B3FD1`; dark: `--bg:#0B0A1F`, `--accent:#A78BFA`.
- Avatar, lonceng, wishlist, glassmorphism lama: tidak dibuat/dikembalikan.
- Semua fitur existing (sheet, filter, anggaran, statistik, ekspor/impor, reset, swipe) tetap berfungsi.
- Test dijalankan dengan `node --test tests/logic.test.mjs` (Node v24, built-in saja).
- Push ke `main`/deploy hanya setelah user menyetujui preview.

## File Structure

- Modify: `index.html` — seluruh perubahan UI/logika (satu-satunya file app).
- Create: `tests/logic.test.mjs` — unit test fungsi murni yang diekstrak dari index.html.
- Modify: `manifest.webmanifest` — warna splash/theme kembali ungu.
- Modify: `sw.js` — `CACHE_NAME` = `catatan-keuangan-v3`.
- Modify: `icons/icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — dibuat ulang gradasi ungu.
- Modify: `README.md` — struktur halaman baru.

---

### Task 1: Palet ungu lama + warna PWA + test harness

**Files:**
- Modify: `index.html:7-8` (meta theme-color), `index.html:19-84` (token `:root` light/dark)
- Modify: `manifest.webmanifest:12-13`
- Test: `tests/logic.test.mjs`

**Interfaces:**
- Consumes: nilai token lama dari commit `90ec629`.
- Produces: `tests/logic.test.mjs` mengekspor pola helper `html`, `extractFn`, `loadLogic` yang dipakai ulang task 2-4.

- [ ] **Step 1: Tulis test harness + assertion palet (failing)**

Buat `tests/logic.test.mjs`:

```js
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

export const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

export function extractFn(name) {
  const m = html.match(new RegExp('function ' + name + '\\([\\s\\S]*?\\n}\\n'))
  if (!m) throw new Error('function not found: ' + name)
  return m[0]
}

export function extractConst(name) {
  const m = html.match(new RegExp('const ' + name + ' = (\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\})\\n'))
  if (!m) throw new Error('const not found: ' + name)
  return 'const ' + name + ' = ' + m[1]
}

export function loadLogic(names, deps = '') {
  const src = names.map(n => n.startsWith('const:') ? extractConst(n.slice(6)) : extractFn(n)).join('\n')
  return new Function(deps + '\n' + src + '\nreturn {' + names.map(n => n.replace('const:', '')).join(',') + '}')()
}

test('palet ungu lama: light', () => {
  assert.match(html, /--bg: #FBF4E4;/)
  assert.match(html, /--accent: #5B3FD1;/)
  assert.match(html, /--text: #1E1638;/)
  assert.match(html, /content="#FBF4E4" media="\(prefers-color-scheme: light\)"/)
})

test('palet ungu lama: dark', () => {
  assert.match(html, /--bg: #0B0A1F;/)
  assert.match(html, /--accent: #A78BFA;/)
  assert.match(html, /--text: #F7EFD9;/)
  assert.match(html, /content="#0B0A1F" media="\(prefers-color-scheme: dark\)"/)
})

test('manifest kembali ungu', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.webmanifest', import.meta.url), 'utf8'))
  assert.equal(manifest.background_color, '#FBF4E4')
  assert.equal(manifest.theme_color, '#5B3FD1')
})
```

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `node --test tests/logic.test.mjs`
Expected: FAIL — token saat ini masih `#F6F3EA`/`#141414`/`#0E0E0C`.

- [ ] **Step 3: Ganti token light/dark dan meta/manifest**

Di `index.html`, ganti seluruh blok `:root` light dengan:

```css
:root {
  --bg: #FBF4E4;
  --surface: rgba(91, 63, 209, 0.07);
  --card: #FFFFFF;
  --field: rgba(255, 255, 255, 0.72);
  --edge: rgba(91, 63, 209, 0.16);
  --hi: rgba(255, 255, 255, 0.95);
  --line: rgba(60, 40, 120, 0.12);
  --text: #1E1638;
  --muted: #655C82;
  --accent: #5B3FD1;
  --accent-ink: #FFFFFF;
  --accent-glow: rgba(91, 63, 209, 0.42);
  --income: #15773A;
  --expense: #B4232C;
  --glass: #FFFFFF;
  --glass-strong: #FFFFFF;
  --glass-shadow: 0 14px 34px rgba(50, 35, 120, 0.16), 0 2px 8px rgba(50, 35, 120, 0.08);
  --lens: #5B3FD1;
  --lens-shadow: 0 5px 16px rgba(91, 63, 209, 0.22);
  --lens-ink: #FFFFFF;
  --sheen: rgba(255, 255, 255, 0.4);
  --glow-1: rgba(167, 139, 250, 0.32);
  --glow-2: rgba(255, 205, 140, 0.5);
  --glow-3: rgba(120, 140, 255, 0.2);
  --scrim: rgba(30, 22, 56, 0.4);
  --stars: 0;
  --chip-active: #5B3FD1;
  --chip-active-ink: #FFFFFF;
  --nav-bg: #1E1638;
  --nav-ink: #F7EFD9;
}
```

Blok dark:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0B0A1F;
    --surface: rgba(255, 255, 255, 0.07);
    --card: #1B1740;
    --field: rgba(255, 255, 255, 0.08);
    --edge: rgba(255, 255, 255, 0.14);
    --hi: rgba(255, 255, 255, 0.22);
    --line: rgba(255, 255, 255, 0.1);
    --text: #F7EFD9;
    --muted: #A9A2CB;
    --accent: #A78BFA;
    --accent-ink: #140F33;
    --accent-glow: rgba(167, 139, 250, 0.45);
    --income: #6EE7A8;
    --expense: #FF8FA3;
    --glass: #1B1740;
    --glass-strong: #1B1740;
    --glass-shadow: 0 16px 38px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.4);
    --lens: #A78BFA;
    --lens-shadow: 0 5px 18px rgba(167, 139, 250, 0.3);
    --lens-ink: #140F33;
    --sheen: rgba(196, 176, 255, 0.24);
    --glow-1: rgba(124, 92, 255, 0.4);
    --glow-2: rgba(56, 84, 210, 0.3);
    --glow-3: rgba(190, 84, 210, 0.24);
    --scrim: rgba(0, 0, 0, 0.6);
    --stars: 0;
    --chip-active: #A78BFA;
    --chip-active-ink: #140F33;
    --nav-bg: #151130;
    --nav-ink: #F7EFD9;
  }
}
```

Meta di `index.html:7-8`:

```html
<meta name="theme-color" content="#FBF4E4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B0A1F" media="(prefers-color-scheme: dark)">
```

`manifest.webmanifest`:

```json
  "background_color": "#FBF4E4",
  "theme_color": "#5B3FD1",
```

Hapus token `--fab-bg`/`--fab-ink` (FAB dihapus pada Task 3). Tambahkan `background: var(--nav-bg); color: var(--nav-ink);` pada `.nav` (menggantikan `background: var(--glass)`), dan `border-color: transparent`.

- [ ] **Step 4: Jalankan test, pastikan lulus**

Run: `node --test tests/logic.test.mjs`
Expected: PASS 3/3.

- [ ] **Step 5: Commit**

```bash
git add index.html manifest.webmanifest tests/logic.test.mjs
git commit -m "feat: kembalikan palet ungu Vanilla/Cosmic untuk layout Spendo"
```

---

### Task 2: Logika & tampilan Kalender (belum di-wire)

**Files:**
- Modify: `index.html` — tambah `calendarCells`, `viewCalendar`, state `selectedDate`, CSS kalender
- Test: `tests/logic.test.mjs`

**Interfaces:**
- Consumes: `daysInMonth`, `pad`, `monthTx`, `sum`, `catOf`, `fmt`, `dayLabel`, `todayStr`, `monthLabel`, `h`, `icon`, `empty`, `openSheet`, `renderPane`.
- Produces: `calendarCells(key) -> Array<{date:string, inMonth:boolean}>` (42 sel, Senin pertama); `viewCalendar() -> HTMLElement`; `state.selectedDate: string|null`.

- [ ] **Step 1: Tambah unit test calendarCells (failing)**

Tambahkan ke `tests/logic.test.mjs`:

```js
test('calendarCells: 42 sel, Senin pertama, Nov 2026 mulai hari Minggu', () => {
  const { calendarCells } = loadLogic(['calendarCells', 'daysInMonth'], 'const pad = n => String(n).padStart(2, \'0\')')
  const cells = calendarCells('2026-11')
  assert.equal(cells.length, 42)
  assert.equal(cells.filter(c => c.inMonth).length, 30)
  assert.equal(cells[6].date, '2026-11-01') // 1 Nov 2026 = Minggu -> kolom ke-7
  assert.equal(cells[35].date, '2026-11-30')
  assert.equal(cells[0].inMonth, false)
})

test('calendarCells: Februari kabisat vs tidak', () => {
  const { calendarCells } = loadLogic(['calendarCells', 'daysInMonth'], 'const pad = n => String(n).padStart(2, \'0\')')
  assert.equal(calendarCells('2024-02').filter(c => c.inMonth).length, 29)
  assert.equal(calendarCells('2026-02').filter(c => c.inMonth).length, 28)
})

test('calendarCells: semua tanggal valid dan berurutan', () => {
  const { calendarCells } = loadLogic(['calendarCells', 'daysInMonth'], 'const pad = n => String(n).padStart(2, \'0\')')
  const days = calendarCells('2026-11').filter(c => c.inMonth).map(c => c.date)
  assert.equal(days[0], '2026-11-01')
  assert.equal(days.at(-1), '2026-11-30')
  assert.equal(new Set(days).size, 30)
})
```

Run: `node --test tests/logic.test.mjs`
Expected: FAIL `function not found: calendarCells`.

- [ ] **Step 2: Implementasi calendarCells**

Tambahkan setelah `daysInMonth` di `index.html`:

```js
function calendarCells(key) {
  const [y, m] = key.split('-').map(Number)
  const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7 // Senin = kolom 0
  const total = daysInMonth(key)
  const cells = []
  for (let i = 0; i < 42; i++) {
    const day = i - lead + 1
    cells.push(day >= 1 && day <= total
      ? { date: key + '-' + pad(day), inMonth: true }
      : { date: '', inMonth: false })
  }
  return cells
}
```

Run: `node --test tests/logic.test.mjs`
Expected: PASS semua.

- [ ] **Step 3: Implementasi viewCalendar + state + CSS**

Tambah `selectedDate: null` pada object `state` di `index.html`. Tambahkan fungsi baru (setelah `viewSummary`):

```js
/* ---------- Halaman: Kalender ---------- */
function viewCalendar() {
  const all = monthTx()
  const exp = all.filter(t => t.type === 'expense')
  const total = sum(exp)
  const byDate = new Map()
  all.forEach(t => {
    if (!byDate.has(t.date)) byDate.set(t.date, [])
    byDate.get(t.date).push(t)
  })

  const fallback = state.month === todayStr().slice(0, 7) ? todayStr() : state.month + '-01'
  const selected = state.selectedDate && state.selectedDate.startsWith(state.month) ? state.selectedDate : fallback

  const grid = h('div', { class: 'cal-grid', role: 'group', 'aria-label': 'Kalender ' + monthLabel(state.month) },
    ...['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => h('span', { class: 'cal-dow' }, d))
  )
  calendarCells(state.month).forEach(cell => {
    if (!cell.inMonth) {
      grid.append(h('span', { class: 'cal-cell out', 'aria-hidden': 'true' }))
      return
    }
    const items = byDate.get(cell.date) || []
    const cats = [...new Set(items.filter(t => t.type === 'expense').map(t => t.category))].slice(0, 3)
    grid.append(h('button', {
      class: 'cal-cell' + (cell.date === selected ? ' sel' : '') + (cell.date === todayStr() ? ' today' : ''),
      'aria-pressed': String(cell.date === selected),
      'aria-label': dayLabel(cell.date) + ', ' + items.length + ' transaksi',
      onclick: () => { state.selectedDate = cell.date; renderPane(2) }
    },
      h('span', { class: 'cal-num' }, Number(cell.date.slice(8))),
      h('span', { class: 'cal-dots' }, ...cats.map(id => h('i', { style: 'background:' + catOf('expense', id).color })))
    ))
  })

  const dayItems = (byDate.get(selected) || []).slice().sort((a, b) => b.created - a.created)
  const dayList = h('div', { class: 'list cal-day-list' },
    h('div', { class: 'day' }, h('span', {}, dayLabel(selected)), h('span', {}, dayItems.length + ' transaksi'))
  )
  if (!dayItems.length) {
    dayList.append(empty('Tidak ada transaksi', 'Pilih tanggal lain atau catat dengan tombol +.'))
  } else {
    dayItems.forEach(t => {
      const cat = catOf(t.type, t.category)
      dayList.append(h('button', { class: 'row', onclick: () => openSheet(t) },
        h('span', { class: 'dot', style: 'background:' + cat.color }),
        h('span', { class: 'mid' }, h('div', { class: 'name' }, cat.name), t.note ? h('div', { class: 'note' }, t.note) : null),
        h('span', { class: 'amt ' + (t.type === 'income' ? 'pos' : 'neg') }, (t.type === 'income' ? '+' : '−') + fmt(t.amount))
      ))
    })
  }

  const byCat = new Map()
  exp.forEach(t => {
    const cat = catOf('expense', t.category)
    byCat.set(cat.id, { cat, value: (byCat.get(cat.id)?.value || 0) + t.amount })
  })
  const items = [...byCat.values()].sort((a, b) => b.value - a.value)

  const totalCard = h('div', { class: 'card cal-total' },
    h('div', { class: 'day' }, h('span', {}, 'Total pengeluaran'), h('strong', {}, fmt(total)))
  )
  if (total) {
    totalCard.append(
      h('div', { class: 'stack', role: 'img', 'aria-label': 'Komposisi pengeluaran per kategori' },
        ...items.map(it => h('i', { style: 'width:' + (it.value / total * 100) + '%;background:' + it.cat.color, title: it.cat.name }))),
      h('div', { class: 'stack-legend' },
        ...items.map(it => h('span', {}, h('i', { style: 'background:' + it.cat.color }), it.cat.name + ' ' + fmt(it.value))))
    )
  }

  return h('div', {},
    h('div', { class: 'card cal-card' }, grid),
    dayList,
    totalCard
  )
}
```

Tambahkan CSS:

```css
/* Kalender */
.cal-card { padding: 14px 12px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-dow { text-align: center; font-size: 11px; font-weight: 600; color: var(--muted); padding: 6px 0; text-transform: uppercase; }
.cal-cell {
  border: 0; background: transparent; aspect-ratio: 1; border-radius: 50%;
  display: grid; place-content: center; justify-items: center; gap: 3px;
  color: var(--text); min-height: 40px;
}
.cal-cell.out { pointer-events: none; }
.cal-cell.today .cal-num { font-weight: 700; color: var(--accent); }
.cal-cell.sel { background: var(--accent); color: var(--accent-ink); }
.cal-cell.sel .cal-num { color: var(--accent-ink); font-weight: 700; }
.cal-num { font-size: 14px; line-height: 1; }
.cal-dots { display: flex; gap: 2px; height: 4px; }
.cal-dots i { width: 4px; height: 4px; border-radius: 50%; }
.cal-day-list { margin-top: 14px; }
.cal-day-list .day { margin-top: 10px; }
.cal-total { margin-top: 14px; padding-bottom: 14px; }
.cal-total .day { margin-top: 10px; color: var(--text); }
.stack { display: flex; height: 10px; border-radius: 999px; overflow: hidden; margin: 10px 18px 0; }
.stack i { display: block; height: 100%; }
.stack-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 10px 18px 0; font-size: 12px; color: var(--muted); }
.stack-legend span { display: inline-flex; align-items: center; gap: 5px; }
.stack-legend i { width: 8px; height: 8px; border-radius: 50%; }
```

- [ ] **Step 4: Jalankan test + smoke manual**

Run: `node --test tests/logic.test.mjs` → PASS.
Buka app via server lokal (`node -e` static server atau `npx serve`), pastikan halaman existing tidak error (fungsi baru belum dipanggil).

- [ ] **Step 5: Commit**

```bash
git add index.html tests/logic.test.mjs
git commit -m "feat: tambah logika dan tampilan halaman Kalender"
```

---

### Task 3: Wiring 4 pane, nav 5 item, header bulan, hapus FAB

**Files:**
- Modify: `index.html` — `PAGES`, `NAV_COLUMNS`, `navLensOffset`, HTML pane, `views`, `tabs`/`navEl`, `renderHeader`, `setProgress`, `setTransitions`, `finishSettle`, `shiftMonth`, `goToCurrentMonth`, indeks `renderPane`, CSS track/nav/header

**Interfaces:**
- Consumes: `viewCalendar` (Task 2), token `--nav-bg`/`--nav-ink` (Task 1).
- Produces: `NAV_COLUMNS = [0, 1, 3, 4]`; `navLensOffset(p:number) -> number`; `PAGES` 4 entri `[home, list, calendar, settings]`; `viewTransactions()` (rename `viewHome` lama); `viewHome()` (rename `viewSummary` lama).

- [ ] **Step 1: Tambah unit test struktur & lens (failing)**

Tambahkan ke `tests/logic.test.mjs`:

```js
test('PAGES: 4 pane dengan urutan template', () => {
  const { PAGES } = loadLogic(['const:PAGES'])
  assert.deepEqual(PAGES.map(p => p.id), ['home', 'list', 'calendar', 'settings'])
})

test('NAV_COLUMNS: tab mengelilingi tombol + di kolom tengah', () => {
  const { NAV_COLUMNS } = loadLogic(['const:NAV_COLUMNS'])
  assert.deepEqual(NAV_COLUMNS, [0, 1, 3, 4])
})

test('navLensOffset: posisi lens mengikuti kolom visual', () => {
  const { navLensOffset } = loadLogic(['navLensOffset', 'const:NAV_COLUMNS', 'const:PAGES'], 'const clamp = (n, a, b) => Math.min(b, Math.max(a, n))')
  assert.equal(navLensOffset(0), 0)
  assert.equal(navLensOffset(1), 100)
  assert.equal(navLensOffset(1.5), 200)
  assert.equal(navLensOffset(2), 300)
  assert.equal(navLensOffset(3), 400)
})

test('markup: 4 pane, tanpa FAB', () => {
  assert.equal((html.match(/<section class="pane"/g) || []).length, 4)
  assert.doesNotMatch(html, /class: 'fab'/)
})
```

Run: `node --test tests/logic.test.mjs`
Expected: FAIL (PAGES masih 3 entri, NAV_COLUMNS/navLensOffset belum ada).

- [ ] **Step 2: Implementasi struktur JS**

Ganti `PAGES` dan tambah `NAV_COLUMNS`:

```js
const PAGES = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'list', label: 'Transaksi', icon: 'list' },
  { id: 'calendar', label: 'Kalender', icon: 'calendar' },
  { id: 'settings', label: 'Pengaturan', icon: 'sliders' }
]
const NAV_COLUMNS = [0, 1, 3, 4]
```

Tambah ikon pada `ICONS`:

```js
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M8 3v4M16 3v4"/>',
```

Rename `viewHome` lama → `viewTransactions`; di dalamnya ubah `renderPane(0)` pada filter menjadi `renderPane(1)`. Rename `viewSummary` → `viewHome`. Di `viewSettings` ubah `renderPane(1)` menjadi `renderPane(0)` (progres anggaran tampil di Home).

Tambah helper lens:

```js
function navLensOffset(p) {
  const i = clamp(Math.floor(p), 0, PAGES.length - 1)
  const j = clamp(i + 1, 0, PAGES.length - 1)
  const t = clamp(p - i, 0, 1)
  return (NAV_COLUMNS[i] + (NAV_COLUMNS[j] - NAV_COLUMNS[i]) * t) * 100
}
```

Ganti blok tabs/nav/fab:

```js
const tabs = PAGES.map((pg, i) => h('button', {
  class: 'tab', style: 'grid-column:' + (NAV_COLUMNS[i] + 1) + ';grid-row:1',
  onclick: () => goTo(i)
}, icon(pg.icon), pg.label))
const addBtn = h('button', {
  class: 'nav-plus', style: 'grid-column:3;grid-row:1',
  'aria-label': 'Tambah transaksi', onclick: () => openSheet(null)
}, icon('plus'))
const navEl = h('nav', { class: 'nav', 'aria-label': 'Menu utama' }, lens, ...tabs, addBtn)
document.body.append(navEl)
```

`views`:

```js
const views = [() => viewHome(), () => viewTransactions(), () => viewCalendar(), () => viewSettings()]
```

Di `setProgress`: ganti `lens.style.transform = 'translate3d(' + (p * 100) + '%,0,0)'` menjadi
`lens.style.transform = 'translate3d(' + navLensOffset(p) + '%,0,0)'`, dan hapus tiga baris `fabO`/`fab.style.*`.
Di `setTransitions` dan `finishSettle`: hapus baris `fab.style.transition`.
Di `shiftMonth` dan `goToCurrentMonth`: tambahkan `state.selectedDate = null` sebelum `renderAll()`.

`renderHeader` gaya template:

```js
function renderHeader() {
  const label = monthLabel(state.month).split(' ')
  topEl.replaceChildren(
    h('button', { class: 'month-side prev', 'aria-label': 'Bulan sebelumnya', onclick: () => shiftMonth(-1) }, monthLabel(shiftMonthKey(state.month, -1)).split(' ')[0]),
    h('button', { class: 'month-big', 'aria-label': 'Kembali ke bulan ini', onclick: goToCurrentMonth }, label[0], h('span', {}, label[1])),
    h('button', { class: 'month-side next', 'aria-label': 'Bulan berikutnya', onclick: () => shiftMonth(1) }, monthLabel(shiftMonthKey(state.month, 1)).split(' ')[0])
  )
}
```

- [ ] **Step 3: Implementasi markup & CSS**

HTML body: ubah tiga `<section class="pane">` menjadi empat dengan `aria-label` berurutan `Home`, `Transaksi`, `Kalender`, `Pengaturan`.

CSS:

```css
#track { display: flex; width: 400%; height: 100%; will-change: transform; }
.pane { flex: 0 0 25%; }
.top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline; padding: calc(env(safe-area-inset-top, 0px) + 14px) 8px 4px; }
.month-side { border: 0; background: transparent; color: var(--muted); opacity: 0.6; font-size: 22px; font-weight: 500; padding: 8px; white-space: nowrap; overflow: hidden; }
.month-side.next { text-align: left; }
.month-side.prev { text-align: right; }
.month-big { border: 0; background: transparent; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; padding: 8px 4px; }
.month-big span { font-size: 15px; font-weight: 500; color: var(--muted); margin-left: 6px; }
.nav { grid-template-columns: repeat(5, 1fr); height: 70px; }
.lens { width: calc((100% - 12px) / 5); }
.nav-plus {
  width: 54px; height: 54px; place-self: center; border: 0; border-radius: 50%;
  background: linear-gradient(135deg, #A78BFA, #5B3FD1); color: #FFFFFF;
  display: grid; place-items: center; transform: translateY(-14px);
  box-shadow: 0 10px 24px var(--accent-glow);
}
.nav-plus:active { transform: translateY(-14px) scale(0.92); }
```

Hapus seluruh blok CSS `.fab` dan `.fab svg.ic`/`.fab:active`. `.month` dan `.icon-btn` yang tidak dipakai lagi boleh dihapus.

- [ ] **Step 4: Test + smoke browser**

Run: `node --test tests/logic.test.mjs` → PASS.
Smoke: buka app, 4 tab + tombol + terlihat, swipe berpindah 4 pane, kalender tampil, tambah transaksi dari tombol + tetap jalan.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/logic.test.mjs
git commit -m "feat: wiring 4 pane swipe dan nav 5 item gaya Spendo"
```

---

### Task 4: Home dashboard, kartu tips, ikon kategori

**Files:**
- Modify: `index.html` — `viewHome`, `donutLabels`, `tipMessage`, `catIcon`, `CAT_ICONS`, `ICONS`, baris `viewTransactions`, CSS donut/kartu/ikon
- Test: `tests/logic.test.mjs`

**Interfaces:**
- Consumes: struktur Task 3 (`viewHome` saat ini masih isi Ringkasan lama).
- Produces: `donutLabels(items,total) -> Array<{id,pct,x,y}>`; `tipMessage({over,top}) -> string`; `catIcon(cat) -> HTMLElement`; `CAT_ICONS: Record<string,string>`.

- [ ] **Step 1: Unit test tipMessage & donutLabels (failing)**

Tambahkan:

```js
test('tipMessage: peringatan anggaran lebih prioritas', () => {
  const { tipMessage } = loadLogic(['tipMessage'])
  const msg = tipMessage({ over: { name: 'Makan dan minum' }, top: { name: 'Transportasi', pct: 60 } })
  assert.match(msg, /Makan dan minum/)
  assert.match(msg, /anggaran/)
})

test('tipMessage: kategori terbesar saat tidak ada anggaran terlampaui', () => {
  const { tipMessage } = loadLogic(['tipMessage'])
  assert.match(tipMessage({ over: null, top: { name: 'Transportasi', pct: 60 } }), /Transportasi \(60%\)/)
})

test('tipMessage: empty state', () => {
  const { tipMessage } = loadLogic(['tipMessage'])
  assert.match(tipMessage({ over: null, top: null }), /Belum ada pengeluaran/)
})

test('donutLabels: persen dibulatkan, segmen kecil disembunyikan', () => {
  const { donutLabels } = loadLogic(['donutLabels'])
  const items = [
    { cat: { id: 'a' }, value: 70 },
    { cat: { id: 'b' }, value: 27 },
    { cat: { id: 'c' }, value: 3 }
  ]
  const labels = donutLabels(items, 100)
  assert.deepEqual(labels.map(l => [l.id, l.pct]), [['a', 70], ['b', 27]])
  labels.forEach(l => {
    assert.ok(l.x >= 0 && l.x <= 160)
    assert.ok(l.y >= 0 && l.y <= 160)
  })
})
```

Run: `node --test tests/logic.test.mjs`
Expected: FAIL `function not found: tipMessage`.

- [ ] **Step 2: Implementasi helper + ikon**

Tambahkan:

```js
function tipMessage({ over, top }) {
  if (over) return 'Pengeluaran ' + over.name + ' melebihi anggaran. Cek lagi pos ini bulan ini.'
  if (top) return 'Kategori terbesar bulan ini: ' + top.name + ' (' + top.pct + '%). Masih sesuai rencana?'
  return 'Belum ada pengeluaran. Tekan + untuk mencatat dan mulai pantau bulan ini.'
}

function donutLabels(items, total) {
  let angle = -Math.PI / 2
  return items.map(it => {
    const frac = it.value / total
    const mid = angle + frac * Math.PI
    angle += frac * 2 * Math.PI
    return { id: it.cat.id, pct: Math.round(frac * 100), x: 80 + Math.cos(mid) * 78, y: 80 + Math.sin(mid) * 78 }
  }).filter(l => l.pct >= 4)
}

const CAT_ICONS = {
  makan: 'food', transport: 'car', kuliah: 'book', belanja: 'bag',
  tagihan: 'receipt', hiburan: 'play', kesehatan: 'health',
  'uang-saku': 'wallet', gaji: 'wallet', beasiswa: 'wallet', freelance: 'wallet'
}

function catIcon(cat) {
  return h('span', { class: 'cat-ic', style: 'background:' + cat.color, 'aria-hidden': 'true' }, icon(CAT_ICONS[cat.id] || 'dots'))
}
```

Tambah path pada `ICONS` (stroke 24px, konsisten dengan ikon existing):

```js
  food: '<path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18M17 3c-2 2-2 6 0 8v10"/>',
  car: '<path d="M5 16l1.5-6h11L19 16"/><rect x="4" y="16" width="16" height="4" rx="1"/><circle cx="8" cy="20" r="1"/><circle cx="16" cy="20" r="1"/>',
  book: '<path d="M5 4h6v16H5zM13 4h6v16h-6z"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  receipt: '<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path d="M9 8h6M9 12h6"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
  health: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
  dots: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
```

CSS:

```css
.cat-ic { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; color: #FFFFFF; flex: none; }
.cat-ic .ic { width: 20px; height: 20px; }
.row .cat-ic { width: 34px; height: 34px; }
.row .cat-ic .ic { width: 17px; height: 17px; }
.donut { width: 250px; height: 250px; }
.donut-pct { position: absolute; transform: translate(-50%, -50%); font-size: 11px; font-weight: 600; color: var(--muted); background: var(--card); border-radius: 999px; padding: 1px 6px; }
.tip { display: flex; gap: 12px; align-items: center; background: rgba(91, 63, 209, 0.1); border: 1px solid var(--edge); border-radius: 20px; padding: 14px 16px; margin-top: 14px; font-size: 14px; }
.tip .cat-ic { background: var(--accent); width: 32px; height: 32px; }
.cat-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: var(--card); border: 1px solid var(--edge); border-radius: 22px; margin-top: 10px; }
.cat-card .mid { flex: 1; min-width: 0; }
.cat-card .name { font-weight: 600; }
.cat-card .last { font-size: 12px; color: var(--muted); }
.cat-card .amt { font-weight: 700; }
.cat-card .bar, .cat-card .budget-note { margin-left: 0; }
```

- [ ] **Step 3: Rewrite viewHome menjadi dashboard**

Ganti isi `viewHome` (hasil rename `viewSummary`) dengan:

```js
function viewHome() {
  const all = monthTx()
  const exp = all.filter(t => t.type === 'expense')
  const income = sum(all, 'income')
  const total = sum(exp)
  if (!total) {
    return h('div', {},
      h('div', { class: 'tip' }, h('span', { class: 'cat-ic', 'aria-hidden': 'true' }, icon('plus')), h('span', {}, tipMessage({ over: null, top: null }))),
      h('div', { class: 'list' }, empty('Belum ada pengeluaran bulan ini', 'Catat pengeluaran dengan tombol + agar ringkasan muncul di sini.'))
    )
  }

  const byCat = new Map()
  exp.forEach(t => {
    const cat = catOf('expense', t.category)
    const prev = byCat.get(cat.id)
    byCat.set(cat.id, {
      cat,
      value: (prev?.value || 0) + t.amount,
      last: !prev || t.date > prev.last ? t.date : prev.last
    })
  })
  const items = [...byCat.values()].sort((a, b) => b.value - a.value)

  const donut = h('div', { class: 'donut' }, h('div', { class: 'mid' },
    h('div', { class: 'k' }, 'Total keluar'), h('div', { class: 'v' }, fmt(total))))
  donut.insertAdjacentHTML('afterbegin', donutSvg(items, total))
  donutLabels(items, total).forEach(l => {
    donut.append(h('span', { class: 'donut-pct', style: 'left:' + (l.x / 160 * 100) + '%;top:' + (l.y / 160 * 100) + '%' }, l.pct + '%'))
  })

  const over = items.find(it => state.data.budgets[it.cat.id] && it.value > state.data.budgets[it.cat.id])
  const tip = h('div', { class: 'tip' },
    h('span', { class: 'cat-ic', 'aria-hidden': 'true' }, icon('wallet')),
    h('span', {}, tipMessage({ over: over ? { name: over.cat.name } : null, top: { name: items[0].cat.name, pct: Math.round(items[0].value / total * 100) } }))
  )

  const cards = items.map(it => {
    const budget = state.data.budgets[it.cat.id]
    const card = h('div', { class: 'cat-card' },
      catIcon(it.cat),
      h('div', { class: 'mid' }, h('div', { class: 'name' }, it.cat.name), h('div', { class: 'last' }, dayLabel(it.last))),
      h('span', { class: 'amt' }, fmt(it.value))
    )
    if (budget) {
      const overBudget = it.value > budget
      card.append(h('div', { class: 'bar' + (overBudget ? ' over' : ''), role: 'img', 'aria-label': 'Terpakai ' + Math.round(it.value / budget * 100) + '% dari anggaran' },
        h('i', { style: 'width:' + Math.min(100, it.value / budget * 100) + '%' })))
      card.append(h('div', { class: 'budget-note' }, overBudget ? 'Melebihi anggaran ' + fmt(it.value - budget) : 'Sisa ' + fmt(budget - it.value)))
    }
    return card
  })

  const isCurrent = state.month === todayStr().slice(0, 7)
  const days = isCurrent ? Number(todayStr().slice(8)) : daysInMonth(state.month)
  const saved = income > 0 ? Math.round((income - total) / income * 100) + '%' : '-'
  const stat = (k, v) => h('div', { class: 'stat' }, h('span', { class: 'k' }, k), h('span', { class: 'v' }, v))

  return h('div', {},
    donut,
    tip,
    h('div', {}, cards),
    h('section', { class: 'stats' },
      h('h2', {}, 'Gambaran bulan ini'),
      stat('Rata-rata keluar per hari', fmt(Math.round(total / days))),
      stat('Pengeluaran terbesar', fmt(items[0].value) + ' (' + items[0].cat.name + ')'),
      stat('Sisa dari pemasukan', saved)
    )
  )
}
```

Catatan layout: `.cat-card` dengan bar anggaran memakai `flex-wrap: wrap` dan `.cat-card .bar { flex-basis: 100%; }` agar bar turun ke baris baru. Tambahkan dua rule tersebut pada CSS task ini.

Di `viewTransactions`, ganti `h('span', { class: 'dot', style: ... })` pada baris transaksi menjadi `catIcon(cat)`. Grid `.row` diubah dari `10px 1fr auto` menjadi `auto 1fr auto`.

- [ ] **Step 4: Test + smoke browser**

Run: `node --test tests/logic.test.mjs` → PASS.
Smoke: Home menampilkan donut + label persen + tips + kartu kategori berikon; anggaran memunculkan bar; Transaksi memakai ikon kategori; light & dark dicek.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/logic.test.mjs
git commit -m "feat: ubah Home jadi dashboard Spendo dengan ikon kategori"
```

---

### Task 5: Ikon PWA ungu, SW v3, README

**Files:**
- Modify: `icons/icon-180.png`, `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png`
- Modify: `sw.js:1`
- Modify: `README.md`
- Test: `tests/logic.test.mjs`

**Interfaces:**
- Consumes: warna Task 1.
- Produces: `CACHE_NAME = 'catatan-keuangan-v3'`.

- [ ] **Step 1: Assertion SW (failing)**

Tambahkan:

```js
test('service worker memakai cache v3', () => {
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8')
  assert.match(sw, /const CACHE_NAME = 'catatan-keuangan-v3'/)
})
```

Run: `node --test tests/logic.test.mjs` → FAIL (masih v2).

- [ ] **Step 2: Update sw.js dan README**

`sw.js`: `const CACHE_NAME = 'catatan-keuangan-v3'`.
`README.md`: perbarui daftar fitur menjadi empat halaman (Home, Transaksi, Kalender, Pengaturan), nav dengan tombol + di tengah, tema ungu Vanilla/Cosmic.

- [ ] **Step 3: Buat ulang ikon ungu**

Simpan dan jalankan PowerShell berikut (`make-icons.ps1` sementara di luar repo):

```powershell
Add-Type -AssemblyName System.Drawing
function New-Icon {
  param([int]$Size, [string]$Path, [double]$TextScale)
  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.TextRenderingHint = 'AntiAliasGridFit'
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($Size, $Size)),
    [System.Drawing.ColorTranslator]::FromHtml('#1B1247'),
    [System.Drawing.ColorTranslator]::FromHtml('#5B3FD1'))
  $g.FillRectangle($brush, 0, 0, $Size, $Size)
  $px = [single]($Size * $TextScale)
  $font = New-Object System.Drawing.Font('Segoe UI', $px, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = 'Center'
  $fmt.LineAlignment = 'Center'
  $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FBF4E4'))
  $g.DrawString('Rp', $font, $ink, $rect, $fmt)
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}
$dir = 'C:\Users\hp\Documents\antigravity\Pencatat Keuangan\icons'
New-Icon -Size 512 -Path (Join-Path $dir 'icon-512.png') -TextScale 0.44
New-Icon -Size 192 -Path (Join-Path $dir 'icon-192.png') -TextScale 0.44
New-Icon -Size 180 -Path (Join-Path $dir 'icon-180.png') -TextScale 0.44
New-Icon -Size 512 -Path (Join-Path $dir 'icon-maskable-512.png') -TextScale 0.3
```

Run: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File make-icons.ps1`
Verifikasi visual salah satu PNG (ungu gradasi, "Rp" krem terbaca).

- [ ] **Step 4: Test + commit**

Run: `node --test tests/logic.test.mjs` → PASS semua.

```bash
git add sw.js README.md tests/logic.test.mjs icons/icon-180.png icons/icon-192.png icons/icon-512.png icons/icon-maskable-512.png
git commit -m "feat: kembalikan ikon ungu dan naikkan cache SW ke v3"
```

---

### Task 6: Verifikasi E2E & preview untuk approval

**Files:**
- Tidak ada perubahan kode kecuali bug yang ditemukan saat verifikasi.

- [ ] **Step 1: Server lokal + browser mobile**

Jalankan static server Node di port 4173 (root repo). Gunakan agent-browser session baru, `set viewport 390 844 2`.

- [ ] **Step 2: Skenario fungsional**

1. Light: screenshot Home, Transaksi, Kalender, Pengaturan, sheet tambah.
2. Tambah transaksi pengeluaran dan pemasukan → muncul di Transaksi, Home, dan titik Kalender.
3. Ketuk tanggal di Kalender → daftar harian berubah; tanggal kosong → "Tidak ada transaksi".
4. Edit dan hapus transaksi dari daftar harian Kalender (confirm diterima).
5. `shiftMonth` ke bulan tanpa data dan ke Februari 2024/2026; kembali ke bulan ini via judul bulan.
6. Filter Semua/Masuk/Keluar; isi anggaran → bar progres dan tips berubah saat terlampaui.
7. Ekspor JSON/CSV, impor JSON, reset data (jangan di data produksi user — hanya origin localhost).
8. Dark mode: screenshot keempat halaman; console bersih; `caches.keys()` berisi `catatan-keuangan-v3`.
9. Reload → transaksi tetap ada.

- [ ] **Step 3: Presentasikan preview**

Kirim screenshot + ringkasan hasil ke user. **STOP — minta approval sebelum push.**

---

### Task 7: Deploy (hanya setelah approval user)

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Verifikasi produksi**

Poll `https://winduathallahahmad-09.github.io/Pencatat-Keuangan-Pribadi/index.html` sampai memuat `#5B3FD1`. Cek `sw.js` berisi `catatan-keuangan-v3`, manifest `#5B3FD1`, keempat ikon 200 `image/png`, dan screenshot produksi menampilkan layout baru.
