module.exports = {
  theme: {
    extend: {
      top: {
        "-1": "-1px",
      },
    },
  },
  variants: {
    backgroundColor: ["group-hover", "hover"],
    borderColor: ["group-focus", "focus", "focus-within"],
    display: ["group-hover"],
    maxWidth: ["responsive"],
  },
  plugins: [],
};
