const fp = require("fastify-plugin");
const discord = require("../shared/discord");

module.exports = fp(function (fastify, _options, next) {
  fastify.decorate("discord", () => discord);
  next();
});
