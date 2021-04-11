const fp = require("fastify-plugin");
const spotify = require("../shared/spotify");

module.exports = fp(async function (fastify, _options) {
  const {
    body: { access_token },
  } = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(access_token);
  fastify.decorate("spotify", () => spotify);
});
