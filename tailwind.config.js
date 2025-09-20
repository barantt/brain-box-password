/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./test.html",
    "./**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#e9e9e9',
          grid: '#fbbf24',
          accent: '#ef4444'
        }
      },
      boxShadow: {
        'game': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'game-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}