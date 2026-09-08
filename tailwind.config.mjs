/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#141414',
          light: '#1f1f1f',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faeec9',
          200: '#f4da93',
          300: '#eec25c',
          400: '#e8ac37',
          500: '#d99a1f',
          600: '#b87817',
          700: '#935816',
          800: '#794718',
          900: '#673c19',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', '"Inter"', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
