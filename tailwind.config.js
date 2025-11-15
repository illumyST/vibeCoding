/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hiragino Sans', 'Yu Gothic UI', 'system-ui', 'sans-serif']
      },
      colors: {
        muji: {
          beige: '#f5f2e8',
          warm: '#faf9f5',
          cream: '#f0ead6',
          lightbrown: '#d4c4a8',
          brown: '#a68b5b',
          darkbrown: '#8b6f47',
          charcoal: '#3a3a3a',
          softgray: '#6b6b6b',
          lightgray: '#e8e6e0',
          red: '#c5504b',
          green: '#7d8471'
        }
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.04)'
      }
    }
  },
  plugins: []
};