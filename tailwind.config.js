/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/js/pages/front/**/*.{js,jsx,ts,tsx}",
    "./resources/views/front.blade.php",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // brand color copy from indigo
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        slate: {
          750: "#283447",
          850: "#162032",
        },
        navy: "#010526",
      },
      screens: {
        xs: "480px",
      },
      aspectRatio: {
        "4/3": "4 / 3",
      },
    },
    fontFamily: {
      sans: ["Poppins", "system-ui", "Arial", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/line-clamp"),
  ],
  daisyui: {
    themes: false,
  },
};
