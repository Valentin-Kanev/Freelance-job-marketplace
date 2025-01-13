/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

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
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({ addBase }) {
      addBase({
        "*": {
          scrollbarWidth: "thin",
        },
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#1D3557",
          borderRadius: "5px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#E63946",
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "#2A2A2A",
          borderRadius: "10px",
        },
        "*::-webkit-scrollbar-button": {
          display: "none",
        },
      });
    }),
  ],
};
