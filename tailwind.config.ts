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
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
