module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      top: {
        "-1": "-1px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["group-hover", "hover"],
      borderWidth: ["first"],
      borderColor: ["group-focus", "focus", "focus-within"],
      brightness: ["hover"],
      display: ["group-hover"],
      margin: ["first"],
      maxWidth: ["responsive"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
