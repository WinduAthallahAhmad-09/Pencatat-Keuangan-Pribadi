import { existsSync, readFileSync } from 'node:fs'
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

test('calendarCells: 42 sel, Senin pertama, Nov 2026 mulai hari Minggu', () => {
  const { calendarCells } = loadLogic(['calendarCells', 'daysInMonth'], 'const pad = n => String(n).padStart(2, \'0\')')
  const cells = calendarCells('2026-11')
  assert.equal(cells.length, 42)
  assert.equal(cells.filter(c => c.inMonth).length, 30)
  assert.equal(cells[6].date, '2026-11-01')
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

test('service worker memakai cache v4', () => {
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8')
  assert.match(sw, /const CACHE_NAME = 'catatan-keuangan-v4'/)
})

test('service worker melewati unduhan APK', () => {
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8')
  assert.match(sw, /url\.pathname\.endsWith\('\.apk'\)/)
})

test('halaman pengaturan menyediakan unduhan APK yang ada', () => {
  assert.match(html, /downloads\/Catatan-Keuangan-debug-1\.0\.0\.apk/)
  assert.ok(existsSync(new URL('../downloads/Catatan-Keuangan-debug-1.0.0.apk', import.meta.url)))
})
