import type { Config } from 'tailwindcss';

/**
 * Charte graphique Vayeko — inspirée de la maquette "Style Vibrant Vayeko / Local".
 * Vert profond + jaune soleil + accents rouge/orange, arrondis généreux.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vayeko: {
          green: {
            DEFAULT: '#0B3B2E',
            dark: '#072A21',
            light: '#145445',
          },
          yellow: {
            DEFAULT: '#FFC800',
            dark: '#F5A300',
            light: '#FFDE6B',
          },
          red: '#E13B3B',
          cream: '#FFF9EF',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 4px 14px -4px rgba(11, 59, 46, 0.15)',
        lift: '0 14px 30px -12px rgba(11, 59, 46, 0.30)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
