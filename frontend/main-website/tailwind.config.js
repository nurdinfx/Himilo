/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', /* slate-900 */
          light: '#334155', /* slate-700 */
        },
        accent: {
          DEFAULT: '#d97706', /* amber-600 */
          light: '#f59e0b', /* amber-500 */
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
