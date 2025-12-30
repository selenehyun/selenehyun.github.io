const { resolve } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    resolve(__dirname, './docs/**/*.{vue,js,ts,jsx,tsx,md}'),
    resolve(__dirname, './docs/.vitepress/**/*.{vue,js,ts,jsx,tsx}'),
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Serif KR', 'serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        wedding: {
          primary: '#d4a574',
          secondary: '#8b7355',
          bg: '#faf8f5',
          text: '#4a4a4a',
          'text-light': '#7a7a7a',
          border: '#e8e4df',
          accent: '#c9a87c',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
