/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef9f0',
          100: '#fef0d6',
          200: '#fddfa4',
          300: '#fbc96d',
          400: '#f9a83a',
          500: '#f78c14',
          600: '#e86f09',
          700: '#c1540a',
          800: '#9a420f',
          900: '#7c3710',
          950: '#431a05',
        },
        sage: {
          50:  '#f3f7f3',
          100: '#e4ede4',
          200: '#c9dcc9',
          300: '#a0c2a0',
          400: '#6fa36f',
          500: '#4e844e',
          600: '#3b6b3b',
          700: '#315531',
          800: '#284528',
          900: '#223922',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(247,140,20,0.15)',
        'glow':    '0 0 40px rgba(247,140,20,0.18)',
        'glow-lg': '0 0 80px rgba(247,140,20,0.22)',
        'card':    '0 2px 16px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.10), 0 16px 48px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'shimmer':    'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backgroundImage: {
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f78c14' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
