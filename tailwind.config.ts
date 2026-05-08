import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)'],
        dm: ['var(--font-dm)'],
      },
      fontWeight: {
        '700': '700',
        '800': '800',
      },
    },
  },
  plugins: [],
};

export default config;