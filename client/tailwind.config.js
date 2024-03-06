/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.jsx",
    "./index.html",
    "./src/components/*.jsx",
    "./src/components/**/*.jsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
