/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/componentes/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#B2FF00',
          hover: '#9EE000',
          suave: 'rgba(178, 255, 0, 0.12)',
          brilho: 'rgba(178, 255, 0, 0.35)',
        },
        escuro: {
          fundo: '#09090B',
          card: '#121214',
          elevado: '#18181B',
          borda: 'rgba(255, 255, 255, 0.08)',
          texto: '#F4F4F5',
          mutado: '#A1A1AA',
        },
        claro: {
          fundo: '#FAFAFA',
          card: '#FFFFFF',
          elevado: '#F4F4F5',
          borda: 'rgba(0, 0, 0, 0.08)',
          texto: '#09090B',
          mutado: '#71717A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        vidro: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        neon: '0 0 20px -3px rgba(178, 255, 0, 0.45)',
        'neon-suave': '0 0 15px -2px rgba(178, 255, 0, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulso-lento': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        aurora: 'aurora 15s ease infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
