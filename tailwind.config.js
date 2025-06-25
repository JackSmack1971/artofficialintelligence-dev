/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ai-primary': '#3B82F6',
        'ai-secondary': '#8B5CF6',
        'ai-accent': '#10B981',
      }
    },
  },
  plugins: [],
}
