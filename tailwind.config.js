/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      colors: {
        masar: {
          blue: '#0ea5e9',
          'blue-dark': '#0284c7',
          emerald: '#10b981',
          'emerald-dark': '#059669',
        },
      },
      animation: {
        'path-glow': 'path-glow 2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
      },
      keyframes: {
        'path-glow': {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgb(16 185 129))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgb(16 185 129))' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
