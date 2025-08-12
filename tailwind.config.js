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
        accent: {
          DEFAULT: "var(--color-accent)",
          10: "rgba(235, 116, 61, 0.1)",
          20: "rgba(235, 116, 61, 0.2)",
          30: "rgba(235, 116, 61, 0.3)",
          40: "rgba(235, 116, 61, 0.4)",
          50: "rgba(235, 116, 61, 0.5)",
          60: "rgba(235, 116, 61, 0.6)",
          70: "rgba(235, 116, 61, 0.7)",
          80: "rgba(235, 116, 61, 0.8)",
          90: "rgba(235, 116, 61, 0.9)",
        },
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
