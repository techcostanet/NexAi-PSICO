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
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Teal médico acolhedor
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        navy: {
          50: '#f4f6fb',
          100: '#e8edf6',
          200: '#ccd8ed',
          300: '#9fb9de',
          400: '#6c94cc',
          500: '#4874b8',
          600: '#345a9d',
          700: '#2b4780',
          800: '#1e325c', // Azul marinho psiquiatria/psicologia
          900: '#15223e',
          950: '#0d1527',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
