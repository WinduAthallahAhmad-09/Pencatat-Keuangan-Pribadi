# 💰 Personal Finance Tracker

A lightweight, beautifully designed personal finance web app that works instantly — no installation required. Perfect for students, freelancers, or anyone who wants to keep track of their income and expenses.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Single File](https://img.shields.io/badge/Single_File-0%20Dependencies-4CAF50?style=flat)
![Offline](https://img.shields.io/badge/100%25-Offline-blue?style=flat)

## ✨ Key Features

- **Transaction Logging** — Record income and expenses with categories, dates, and notes
- **Home Dashboard** — Donut chart, dynamic tips, category cards, and monthly statistics
- **Transaction List** — Filter income and expenses by type and day
- **Calendar View** — Browse daily transactions and monthly category totals
- **Monthly Budgets** — Set spending limits per category and track your progress
- **Four-Page Navigation** — Swipe between Home, Transactions, Calendar, and Settings, or use the five-item navigation bar with a central **+** action
- **Dark & Light Mode** — Automatically adapts to system preference (Vanilla & Cosmic themes)
- **Mobile Responsive** — Optimized for smartphones with a native-like experience
- **Installable PWA** — Install on your Android home screen and use it like a native app, fully offline
- **Export & Import** — Back up your data as JSON or CSV, and restore anytime
- **Serverless** — All data is stored in the browser's `localStorage`, 100% offline

## 🎨 Design

The app uses a clean, card-based Spendo-inspired layout with the legacy purple Vanilla and Cosmic color palettes:

- Five-item bottom navigation with a moving lens and central **+** button
- Large month header, donut chart, category icons, and a full calendar page
- Parallax and ripple effects during page transitions
- Solid, high-contrast cards in both light (Vanilla) and dark (Cosmic) themes

## 📂 Project Structure

```
Pencatat Keuangan/
├── index.html               # Entire application (HTML + CSS + JS)
├── manifest.webmanifest     # PWA manifest (name, icons, standalone display)
├── sw.js                    # Service worker (offline app-shell cache)
├── icons/                   # App icons (180, 192, 512, maskable)
└── README.md                # Documentation
```

The application itself is a **single-file app** — all HTML, CSS, and JavaScript are bundled into one file with zero external dependencies. The manifest and service worker only add installability and offline caching.

## 🚀 Getting Started

1. **Open directly in your browser**
   ```
   Double-click "index.html"
   ```
   Or open it in your preferred browser (Chrome, Firefox, Safari, Edge).

2. **Or deploy to static hosting**
   Upload the folder to GitHub Pages, Netlify, Vercel, or any HTTPS static hosting provider. Service workers (offline mode) only work over HTTPS or on `localhost`.

### 📲 Install on Android (PWA)

1. Open the hosted app URL in Chrome on your Android phone.
2. Tap the **⋮** menu → **Install app** (or **Add to Home screen**).
3. The app now opens full-screen from your home screen and works fully offline.

> Data from the old `file://` version is not shared with the installed app. Open the old file → **Ekspor JSON**, then in the installed app → **Impor JSON**.

## 📖 Usage Guide

### Adding a Transaction
1. Tap the central **+** button in the bottom navigation
2. Select type: **Expense** or **Income**
3. Enter the amount, choose a category, date, and optional note
4. Tap **Save**

### Viewing the Dashboard
- Open **Home** to see the expense donut chart, dynamic tips, and category cards
- View statistics: daily average, largest expense, and savings ratio

### Using the Calendar
- Open **Calendar** and tap a date to see that day's transactions
- Expense-category dots appear on dates with spending
- Monthly expense totals and category breakdowns appear below the daily list

### Setting Budgets
1. Swipe to the **Settings** page
2. Set a budget limit for each expense category
3. Budget progress and over-budget tips will appear on the Home page

### Month Navigation
- Tap the previous or next month name at the top to switch months
- Tap the current month title to jump back to the current month

### Export & Import
- **Export JSON** — Back up all data (can be re-imported)
- **Export CSV** — Open in Excel or Google Sheets
- **Import JSON** — Restore data from a backup file

## 📊 Default Categories

### Expenses
| Category | Color |
|---|---|
| 🍽️ Food & Drinks | Yellow |
| 🚗 Transportation | Blue |
| 🎓 Education | Purple |
| 🛒 Shopping | Pink |
| 📱 Bills & Top-up | Teal |
| 🎮 Entertainment | Orange |
| 💊 Health | Green |
| 📦 Others | Gray |

### Income
| Category |
|---|
| 💵 Allowance |
| 💼 Salary |
| 🎓 Scholarship |
| 💻 Freelance |
| 📦 Others |

## 🛠️ Technology

Built as a **single-file application** — all markup, styling, and logic are packaged into a single HTML file with no external dependencies, allowing it to run directly in any browser without a build process.

| Technology | Implementation |
|---|---|
| **HTML5** | Semantic structure with ARIA attributes for accessibility |
| **CSS3** | Inline `<style>` — CSS custom properties, solid cards, responsive layouts, media queries, and keyframe animations |
| **Vanilla JavaScript** | Inline `<script>` — DOM manipulation, state management, and gesture handling without any framework |
| **Web Storage API** | Local data persistence via `localStorage` |
| **Web Share API** | Native file sharing for data export on supported devices |

## ⚠️ Important Notes

- Data is stored **only in this browser**. Clearing browser data will erase all transactions.
- **Export regularly** to back up your data.
- The app runs entirely **offline** — no internet connection required.

## 📄 License

This project is open-source. Feel free to use, modify, and distribute as needed.
