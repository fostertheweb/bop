const fp = require("fastify-plugin");
const spotify = require("../shared/spotify");

module.exports = fp(function (fastify, _options, next) {
  function getCredentials() {
    spotify.clientCredentialsGrant().then(
      function onSuccess(response) {
        spotify.setAccessToken(response.body.access_token);
      },
      function onError(err) {
        fastify.log.error(err);
      },
    );
  }

  getCredentials();
  setInterval(getCredentials, 1000 * 60 * 60);

  fastify.decorate("spotify", () => spotify);

  next();
});
