/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'enterprise-dark': '#0f172a',
        'enterprise-darker': '#020617',
        'enterprise-card': '#1e293b',
        'primary-indigo': '#4f46e5',
        'primary-indigo-light': '#818cf8',
        'accent-emerald': '#10b981',
        'accent-emerald-light': '#34d399',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
