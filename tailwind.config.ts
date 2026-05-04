import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta original (mantida para o painel admin)
        green: {
          50: '#f0f7f4',
          100: '#dceee5',
          200: '#b8ddcc',
          300: '#87c4a8',
          400: '#57a882',
          500: '#359166',
          600: '#267351',
          700: '#1f5c42',
          800: '#1a4a35',
          900: '#153d2c',
        },
        // Nova paleta da marca
        terra: {
          DEFAULT: '#d9a48e',
          light: '#f5e8e0',
          hover: '#c9927b',
          dark: '#b87a64',
        },
        plum: {
          DEFAULT: '#290f27',
          light: '#3d1a3a',
          lighter: '#521d4e',
          50: '#f5eef5',
          100: '#e8d5e8',
        },
        sage: {
          DEFAULT: '#c6d6c5',
          light: '#e8edea',
          dark: '#a8b8a7',
          50: '#f0f3f0',
        },
        cream: {
          DEFAULT: '#f7f5f2',
          dark: '#ede9e3',
        },
        muted: '#a8a8a8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
