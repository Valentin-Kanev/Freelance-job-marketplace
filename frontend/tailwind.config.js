/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1D3557",
        secondary: "#F0F4F8",
        accent: "#2A9D8F",
        error: "#E63946",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Apply Roboto as the default sans-serif font
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
