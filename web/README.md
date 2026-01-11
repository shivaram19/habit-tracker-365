# ChromaLife Web Frontend 🎨

A beautiful, nostalgic habit tracker with an "Anti-AI" aesthetic inspired by Windows 98 and digital scrapbooks.

![ChromaLife Preview](https://via.placeholder.com/800x400/fdfbf7/cc5500?text=ChromaLife+-+Your+Digital+Scrapbook)

## ✨ Features

- **24-Hour Painter Grid**: Click and drag to paint your daily activities
- **365-Day Heatmap**: GitHub-style contribution graph of your habits
- **Category Tracking**: 12 colorful activity categories
- **Local Storage**: All data persists in your browser
- **Responsive Design**: Desktop sidebar, mobile bottom navigation
- **Wabi-Sabi Aesthetic**: Organic shapes, hand-drawn feel, nostalgic colors

## 🎨 Design Philosophy

This project embraces an **anti-AI aesthetic** with:

- **Imperfect Organic Shapes**: No perfect circles or rectangles
- **Paper Grain Texture**: Subtle SVG noise filter on cream background
- **Hand-drawn Typography**: Patrick Hand and Gochi Hand fonts
- **Crayola Palette**: Burnt Orange, Dandelion, Cerulean, Brick Red
- **Y2K Interactions**: Hard press effects, jiggle animations, pixelated cursor
- **Thick Borders**: 2-3px solid borders everywhere
- **No Shadows**: Flat design with occasional hard shadows

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── CategoryBubble.tsx    # Category selector bubble
│   │   ├── Heatmap.tsx           # 365-day visualization
│   │   ├── Layout.tsx            # Main app shell
│   │   └── PainterGrid.tsx       # 24-hour drag-to-paint grid
│   ├── pages/
│   │   ├── LogScreen.tsx         # Daily logging interface
│   │   ├── HistoryScreen.tsx     # Heatmap view
│   │   ├── WrappedScreen.tsx     # Analytics (coming soon)
│   │   └── ProfileScreen.tsx     # Settings & data export
│   ├── utils/
│   │   └── categories.ts         # Category definitions
│   ├── App.tsx                   # Root component
│   ├── index.css                 # Global styles with Tailwind
│   └── main.tsx                  # Entry point
├── tailwind.config.js            # Custom theme & utilities
└── package.json
```

## 🎯 Core Components

### PainterGrid
The heart of ChromaLife - an interactive 24-hour grid where users paint their day.

**Features:**
- Mouse down + drag to paint multiple hours
- Overwrite confirmation modal
- Responsive grid (4-12 columns based on screen size)
- Batch change support for undo
- Custom pencil cursor

### CategoryBubble
Animated category selector with emoji icons and color-coding.

**Features:**
- Framer Motion animations
- Scale and rotation on hover/selection
- 12 predefined categories

### Heatmap
GitHub-style contribution graph showing 365 days of activity.

**Features:**
- Intensity-based opacity
- Dominant category coloring
- Hover tooltips with date and hours logged

### Layout
Responsive navigation shell.

**Features:**
- Desktop: Left sidebar with notebook tabs
- Mobile: Top header + bottom navigation
- Smooth page transitions
- Mobile menu overlay

## 🎨 Category Colors

| ID | Category | Color | Emoji |
|----|----------|-------|-------|
| 1 | Work | Green | 💼 |
| 2 | Sleep | Blue | 😴 |
| 3 | Exercise | Orange | 💪 |
| 4 | Food | Red | 🍔 |
| 5 | Shopping | Purple | 🛍️ |
| 6 | Social | Pink | 👥 |
| 7 | Entertainment | Yellow | 🎮 |
| 8 | Travel | Teal | ✈️ |
| 9 | Learning | Indigo | 📚 |
| 10 | Chores | Gray | 🧹 |
| 11 | Health | Cyan | 🏥 |
| 12 | Other | Neutral | 📌 |

## 💾 Data Storage

All data is stored in browser `localStorage`:

```typescript
// Data structure
{
  "chromalife-days": {
    "2026-01-11": {
      "date": "2026-01-11",
      "hourlyLogs": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 4, 4, 5, 6, 0, 0, 0],
      "totalSpend": 45.50,
      "highlight": "Great productive day!"
    }
  }
}
```

**Export**: Profile screen has a JSON export button
**Import**: Paste exported JSON back into localStorage

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom utilities
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **TanStack Query** - (Ready for API integration)

## 🎭 Custom Tailwind Utilities

```css
/* Organic border radius */
rounded-organic
rounded-organic-lg
rounded-wabi

/* Hard shadows */
shadow-hard
shadow-hard-sm

/* Animations */
animate-jiggle
animate-press
animate-wiggle

/* Cursors */
cursor-pencil
cursor-hand

/* Components */
.btn
.card
.input
.hour-block
.nav-tab
.heatmap-day
```

## 🌈 Color Palette

```css
--paper-bg: #fdfbf7     /* Cream/Paper */
--ink-color: #2c2c2c    /* Ink Black */

--burnt-orange: #cc5500
--dandelion: #ffd700
--cerulean: #007ba7
--brick-red: #cb4154
```

## 🚧 Roadmap

- [ ] Add list items management (Food & Shopping)
- [ ] Implement spending tracker
- [ ] Build Wrapped analytics with charts
- [ ] Add filters and search to History
- [ ] Implement data sync (backend integration)
- [ ] PWA support for offline use
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality
- [ ] Export to PDF/image

## 📝 Notes for Backend Integration

Current implementation uses `localStorage` for persistence. To integrate with the ChromaLife backend API:

1. Replace `useLocalStorage` hook with API calls
2. Install axios: `npm install axios`
3. Create `src/services/api.ts` with endpoints
4. Wrap app in TanStack Query provider
5. Update data fetching in all screens

Example API service:

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const getDays = async (userId: string) => {
  const { data } = await api.get(`/days?userId=${userId}`);
  return data;
};

export const updateDay = async (dayData: DayData) => {
  const { data } = await api.post('/days', dayData);
  return data;
};
```

## 🤝 Contributing

This project follows the mobile PRD requirements. When adding features:

1. Match the mobile app's behavior
2. Maintain the wabi-sabi aesthetic
3. Keep organic shapes and hand-drawn feel
4. Use provided color palette
5. Test on mobile and desktop

## 📄 License

MIT

## 🎉 Credits

Built with ❤️ and a little chaos ✨

**Design Inspiration:**
- Windows 98 UI
- Crayola crayon aesthetics
- GitHub contribution graphs
- Japanese wabi-sabi philosophy
- Y2K digital artifacts

---

**ChromaLife** - Your digital scrapbook for tracking life's colorful moments.
