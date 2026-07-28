/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        card: 'var(--bg-card)',
        cardHover: 'var(--bg-card-hover)',
        input: 'var(--bg-input)',
        borderBase: 'var(--border-color)',
        borderHover: 'var(--border-hover)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        textSubtle: 'var(--text-subtle)',
      },
    },
  },
  plugins: [],
}
