const defaultTheme = require('tailwindcss/defaultTheme')

const FONT_FAMILY = process.env.NEXT_PUBLIC_FONT_FAMILY || 'Inter'
const PRIMARY_COLOR = process.env.NEXT_PUBLIC_PRIMARY_COLOR || 'blue'

const primaryColors = {
  red: {
    100: '#fee2e2',
    300: '#fca5a5',
    500: '#ef4444',
    700: '#b91c1c',
    900: '#7f1d1d',
  },
  orange: {
    100: '#ffedd5',
    300: '#fdba74',
    500: '#f97316',
    700: '#c2410c',
    900: '#7c2d12',
  },
  lime: {
    100: '#ecfccb',
    300: '#bef264',
    500: '#84cc16',
    700: '#4d7c0f',
    900: '#365314',
  },
  green: {
    100: '#dcfce7',
    300: '#86efac',
    500: '#22c55e',
    700: '#15803d',
    900: '#14532d',
  },
  blue: {
    100: '#dbeafe',
    300: '#93c5fd',
    500: '#3b82f6',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  default: {
    100: '#F1E5FF',
    300: '#E2CCFF',
    500: '#A966FF',
    700: '#7000FF',
    900: '#430099',
  },
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [`"${FONT_FAMILY}"`, ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',

        'spin-reverse': 'spin 1s reverse linear infinite',
      },
      colors: {
        primary: primaryColors[PRIMARY_COLOR],
      },
    },
  },
  plugins: [
    require('tailwindcss-radix')(),
    require('@ramosdiego/reservoir')({
      buttons: {
        animate: true,
      },
    }),
  ],
}
