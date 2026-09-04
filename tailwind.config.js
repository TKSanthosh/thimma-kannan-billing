/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pooja: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        temple: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        shop: {
          green: '#15803d',
          darkGreen: '#166534',
          gold: '#b45309',
        }
      },
      fontFamily: {
        tamil: [
          'Noto Sans Tamil',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Mukta Malar',
          'Latha',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}
