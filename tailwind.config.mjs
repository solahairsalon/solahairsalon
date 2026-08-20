/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#211613',
        cream: '#fbf7f2',
        rose: {
          50: '#fdf3f0',
          100: '#f9e2da',
          400: '#c97a63',
          500: '#a8503a',
          600: '#8a3b2e',
          700: '#6e2e24',
        },
        sand: '#ecdfd0',
        gold: '#c79a56',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(33, 22, 19, 0.18)',
      },
    },
  },
  plugins: [],
};
