/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#59b0ff',
          500: '#3490fc',
          600: '#1d71f1',
          700: '#155bde',
          800: '#184ab4',
          900: '#1a418d',
          950: '#152956',
        }
      }
    },
  },
  plugins: [],
}
