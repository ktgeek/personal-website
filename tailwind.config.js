/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.njk",
    "./src/**/*.md",
    "./src/**/*.html"
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
};
