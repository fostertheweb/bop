module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      top: {
        "-1": "-1px",
      },
    },
  },
  variants: {
    backgroundColor: ["group-hover", "hover"],
    borderWidth: ["first"],
    borderColor: ["group-focus", "focus", "focus-within"],
    display: ["group-hover"],
    margin: ["first"],
    maxWidth: ["responsive"],
  },
  plugins: [require("@tailwindcss/forms")],
};
