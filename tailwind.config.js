/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        winter: {
          ...require("daisyui/src/colors/themes")["[data-theme=winter]"],
          primary: "#00B4DB"
        }
      },
      {
        night: {
          ...require("daisyui/src/colors/themes")["[data-theme=night]"],
          primary: "#00B4DB"
        }
      }
    ],
    darkTheme: "night"
  },
  extend: {
    colors: {
      primary: "#01AED6"
    }
  }
}
