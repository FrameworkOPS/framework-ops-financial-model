/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  safelist: [
    'text-emerald-400', 'text-yellow-400', 'text-red-400',
    'bg-emerald-900/20', 'bg-yellow-900/20', 'bg-red-900/20',
    'border-emerald-700', 'border-yellow-700', 'border-red-700',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#061220',
          900: '#081B2F',
          800: '#0d2540',
          700: '#102d4d',
          600: '#16395e',
          500: '#1e4a78',
        },
        brand: {
          emerald: '#10B981',
          'emerald-dark': '#059669',
          offwhite: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}
