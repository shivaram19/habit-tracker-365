/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sleep: '#4C6EF5',
        work: '#F59F00',
        social: '#15B981',
        exercise: '#EC4899',
        food: '#8B5CF6',
        entertainment: '#06B6D4',
        travel: '#EF4444',
        learning: '#14B8A6',
        family: '#84CC16',
        shopping: '#F97316',
        health: '#06B6D4',
        empty: '#E5E7EB',
      },
      elevation: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        8: 8,
      },
    },
  },
  plugins: [],
}
