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
        sans: ["Roboto", "sans-serif"], // Apply Roboto as the default sans-serif font
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({ addBase }) {
      addBase({
        /* Global dark and rounded scrollbars */
        "*": {
          scrollbarWidth: "thin" /* Firefox */,
        },
        "*::-webkit-scrollbar": {
          width: "8px" /* Narrow scrollbar */,
          height: "8px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#1D3557" /* Dark thumb */,
          borderRadius: "5px" /* Fully rounded corners */,
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#E63946" /* Reddish hover effect */,
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "#2A2A2A" /* Subtle dark background */,
          borderRadius: "10px",
        },
      });
    }),
  ],
};
