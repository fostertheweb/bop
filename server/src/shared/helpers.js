const { Command } = require("ioredis");

module.exports = {
  setJSON(key, value) {
    const json = JSON.stringify(value);
    return new Command("JSON.SET", [key, ".", json]);
  },

  getJSON(key) {
    return new Command("JSON.GET", [key]);
  },

  removeJSON(key) {
    return new Command("JSON.DEL", [key]);
  },
};
