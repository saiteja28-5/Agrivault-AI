/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          forest: '#244A38',
          deep: '#183629',
          sage: '#829B82',
          bg: '#F5F6F1',
          card: '#FFFFFF',
          text: '#202A25',
          muted: '#78817B',
          border: '#E5E9E3',
          amber: '#D69A35',
          red: '#C6534D',
          green: '#4C8965',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

