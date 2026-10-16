/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d8ff',
          300: '#9dbaff',
          400: '#6990ff',
          500: '#3b62ff',
          600: '#1e3df6',
          700: '#142cdb',
          800: '#1426b1',
          900: '#16258a',
          950: '#0c1453',
        },
        navy: {
          800: '#0f172a',
          850: '#0b1120',
          900: '#070d19',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
