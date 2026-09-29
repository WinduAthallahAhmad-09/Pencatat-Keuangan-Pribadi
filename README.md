# 💰 Personal Finance Tracker

A lightweight, beautifully designed personal finance web app that works instantly — no installation required. Perfect for students, freelancers, or anyone who wants to keep track of their income and expenses.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Single File](https://img.shields.io/badge/Single_File-0%20Dependencies-4CAF50?style=flat)
![Offline](https://img.shields.io/badge/100%25-Offline-blue?style=flat)

## ✨ Key Features

- **Transaction Logging** — Record income and expenses with categories, dates, and notes
- **Visual Summary** — Interactive donut chart showing expense distribution by category
- **Monthly Budgets** — Set spending limits per category and track your progress
- **Gesture Navigation** — Swipe between pages with fluid, native-like animations
- **Dark & Light Mode** — Automatically adapts to system preference (Vanilla & Cosmic themes)
- **Mobile Responsive** — Optimized for smartphones with PWA-style experience
- **Export & Import** — Back up your data as JSON or CSV, and restore anytime
- **Serverless** — All data is stored in the browser's `localStorage`, 100% offline

## 🎨 Design

The app features a **glassmorphism** design language with blur effects, transparency, and smooth animations:

- Bottom navigation bar with a moving glass lens effect
- Parallax and ripple effects during page transitions
- Micro-interaction animations on buttons and interactive elements
- Harmonious color palettes for both light (Vanilla) and dark (Cosmic) themes

## 📂 Project Structure

```
Pencatat Keuangan/
├── Pencatat keuangan.html   # Entire application (HTML + CSS + JS)
└── README.md                # Documentation
```

This is a **single-file application** — all HTML, CSS, and JavaScript are bundled into one file with zero external dependencies.

## 🚀 Getting Started

1. **Open directly in your browser**
   ```
   Double-click "Pencatat keuangan.html"
   ```
   Or open it in your preferred browser (Chrome, Firefox, Safari, Edge).

2. **Or deploy to static hosting**
   Upload the HTML file to GitHub Pages, Netlify, Vercel, or any static hosting provider.

## 📖 Usage Guide

### Adding a Transaction
1. Tap the **+** button (FAB) at the bottom right
2. Select type: **Expense** or **Income**
3. Enter the amount, choose a category, date, and optional note
4. Tap **Save**

### Viewing Summary
- Swipe to the **Summary** page to see the expense donut chart
- View statistics: daily average, largest expense, and savings ratio

### Setting Budgets
1. Swipe to the **Settings** page
2. Set a budget limit for each expense category
3. Budget progress will appear on the Summary page

### Month Navigation
- Use the **◀ ▶** buttons at the top to switch between months
- Tap the month name to jump back to the current month

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
| **CSS3** | Inline `<style>` — CSS custom properties, glassmorphism, media queries, and keyframe animations |
| **Vanilla JavaScript** | Inline `<script>` — DOM manipulation, state management, and gesture handling without any framework |
| **Web Storage API** | Local data persistence via `localStorage` |
| **Web Share API** | Native file sharing for data export on supported devices |

## ⚠️ Important Notes

- Data is stored **only in this browser**. Clearing browser data will erase all transactions.
- **Export regularly** to back up your data.
- The app runs entirely **offline** — no internet connection required.

## 📄 License

This project is open-source. Feel free to use, modify, and distribute as needed.
