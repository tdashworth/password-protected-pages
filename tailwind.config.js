/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "sans": ["Ubuntu", "sans-serif"]
    },
    extend: {
      colors: {
        primary: {
          300: "#0eaddc",
          700: "#0b75b0",
        },
      },
    },
  },
}
