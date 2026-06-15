/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink:    { DEFAULT: '#0D0D14', 50: '#F5F5F8', 100: '#E8E8EF', 200: '#C4C4D4', 300: '#9292A8', 400: '#5E5E7A', 500: '#3A3A55', 600: '#25253D', 700: '#1A1A2E', 800: '#111120', 900: '#0D0D14' },
        amber:  { DEFAULT: '#F4A229', 50: '#FFF9EC', 100: '#FEEEC8', 200: '#FDDC90', 300: '#FCC95A', 400: '#F4A229', 500: '#E08810', 600: '#BA6E09', 700: '#925507', 800: '#6B3E05', 900: '#472803' },
        jade:   { DEFAULT: '#2DC98A', 50: '#EDFBF5', 100: '#CBF6E5', 200: '#88ECC5', 300: '#47DFA4', 400: '#2DC98A', 500: '#22A872', 600: '#19865B', 700: '#116344', 800: '#0B422D', 900: '#062518' },
        rose:   { DEFAULT: '#F05252', 50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171', 500: '#F05252', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D' },
        sky:    { DEFAULT: '#3B9EFF', 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B9EFF', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
      },
      animation: {
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fadeIn 0.3s ease',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        glow:     { from: { boxShadow: '0 0 20px rgba(244,162,41,0.2)' }, to: { boxShadow: '0 0 40px rgba(244,162,41,0.5)' } },
      },
    },
  },
  plugins: [],
}
