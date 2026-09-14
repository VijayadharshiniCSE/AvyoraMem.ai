/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06070A',
          900: '#0B0D13',
          850: '#11141C',
          800: '#181C26',
          700: '#232838',
        },
        gold: {
          300: '#F5E6B3',
          400: '#E6CA7E',
          500: '#D4AF37',
          600: '#B89428',
          700: '#8C6F19',
        },
        platinum: {
          100: '#F7F8FA',
          200: '#EBECEF',
          300: '#D6D8DE',
          400: '#A4A8B5',
        },
        luxe: {
          emerald: '#10B981',
          rose: '#E06C75',
          violet: '#8B5CF6',
          champagne: '#F3E5AB'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
