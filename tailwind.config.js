const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "var(--color-text)",
        background: "var(--color-background)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        surface: 'var(--color-surface)',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ':root': {
          '--color-text': '#020008',
          '--color-background': '#F0F0F0',
          '--color-primary': '#1D719D',
          '--color-secondary': '#2C394C',
          '--color-accent': '#eb743d',
          '--color-surface': '#f4f4f5',
        },
        '.dark': {
          '--color-text': '#efedeb',
          '--color-background': '#000000',
          '--color-primary': '#64dbfc',
          '--color-secondary': '#1c6f9b',
          '--color-accent': '#eb743d',
          '--color-surface': '#1a1f2e',
        },
      });
    }),
  ],
};
