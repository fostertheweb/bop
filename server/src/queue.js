const Redis = require("ioredis");

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
});

function setJSON(key, value) {
  return new Redis.Command("JSON.SET", [key, ".", JSON.stringify(value)]);
}

function getJSON(key) {
  return new Redis.Command("JSON.GET", [key]);
}

module.exports = { redis, setJSON, getJSON };