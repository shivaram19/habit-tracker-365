/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wabi-Sabi Palette
        paper: '#fdfbf7',
        cream: '#fdfbf7',
        ink: '#2c2c2c',
        
        // Nostalgic Crayola Colors
        'burnt-orange': '#cc5500',
        'dandelion': '#ffd700',
        'cerulean': '#007ba7',
        'brick-red': '#cb4154',
        'forest-green': '#228b22',
        'violet': '#8b5cf6',
        'sky-blue': '#87ceeb',
        'sunset-orange': '#ff7f50',
        
        // Category Colors (from mobile app)
        categories: {
          0: '#e5e5e5',  // Empty/None
          1: '#4ade80',  // Work - Green
          2: '#3b82f6',  // Sleep - Blue
          3: '#fb923c',  // Exercise - Orange
          4: '#ef4444',  // Food - Red
          5: '#a855f7',  // Shopping - Purple
          6: '#ec4899',  // Social - Pink
          7: '#facc15',  // Entertainment - Yellow
          8: '#14b8a6',  // Travel - Teal
          9: '#6366f1',  // Learning - Indigo
          10: '#94a3b8', // Chores - Gray
          11: '#06b6d4', // Health - Cyan
          12: '#71717a', // Other - Neutral
        },
      },
      fontFamily: {
        heading: ['"Patrick Hand"', '"Gochi Hand"', 'cursive'],
        mono: ['"Space Mono"', '"Courier Prime"', 'monospace'],
        body: ['"Space Mono"', '"Courier Prime"', 'monospace'],
      },
      borderRadius: {
        // Organic, imperfect border radius utilities
        'organic-sm': '12px 8px 10px 9px / 9px 10px 8px 12px',
        'organic': '15px 10px 13px 11px / 11px 13px 10px 15px',
        'organic-lg': '20px 15px 18px 16px / 16px 18px 15px 20px',
        'organic-xl': '25px 18px 22px 19px / 19px 22px 18px 25px',
        'organic-2xl': '30px 20px 28px 22px / 22px 28px 20px 30px',
        'organic-3xl': '40px 28px 35px 30px / 30px 35px 28px 40px',
        
        // Wabi-sabi shapes (more extreme)
        'wabi': '255px 15px 225px 15px / 15px 225px 15px 255px',
        'wabi-alt': '15px 255px 15px 225px / 225px 15px 255px 15px',
      },
      boxShadow: {
        'none': 'none', // No shadows for that flat, Y2K look
        'hard': '3px 3px 0px 0px rgba(44, 44, 44, 1)', // Hard shadow effect
        'hard-sm': '2px 2px 0px 0px rgba(44, 44, 44, 1)',
      },
      animation: {
        'jiggle': 'jiggle 0.3s ease-in-out',
        'press': 'press 0.1s ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        jiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        press: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(3px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

