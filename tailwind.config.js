/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./demo/**/*.{html,js}",
    "./demo-app/**/*.{html,js}",
    "./demo-web/**/*.{html,js}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'enterprise-dark': '#111827',
        'enterprise-darker': '#080b12',
        'enterprise-card': '#151b26',
        'primary-indigo': '#2563eb',
        'primary-indigo-light': '#60a5fa',
        'accent-emerald': '#059669',
        'accent-emerald-light': '#34d399',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
