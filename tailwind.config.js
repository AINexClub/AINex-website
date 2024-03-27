/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./front-end/src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["winter", "night", "nord", "business"],
  },
};
