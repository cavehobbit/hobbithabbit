/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#1a3a1a',
          100: '#1f4620',
          200: '#0D2818',
          300: '#7CB77C',
          400: '#5A9C5A',
          500: '#2D5A2D',
          600: '#1F4620',
          700: '#0D2818',
          800: '#051409',
          900: '#000000',
        },
        primary: {
          500: '#2D5A2D',
          600: '#1F4620',
          700: '#0D2818',
        },
      },
      borderRadius: {
        'none': '0px',
      },
    },
  },
  plugins: [],
}