/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-open': '#ef4444',
        'status-progress': '#f59e0b',
        'status-review': '#3b82f6',
        'status-testing': '#8b5cf6',
        'status-done': '#10b981',
      },
    },
  },
  plugins: [],
} 