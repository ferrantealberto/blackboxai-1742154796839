/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#42a5f5',
          main: '#1976d2',
          dark: '#1565c0',
        },
        secondary: {
          light: '#ff4081',
          main: '#dc004e',
          dark: '#c51162',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0,0,0,0.1)',
        dropdown: '0 2px 8px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      minHeight: {
        'screen-75': '75vh',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      zIndex: {
        '-1': '-1',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
  important: true,
  corePlugins: {
    preflight: true,
  },
};
