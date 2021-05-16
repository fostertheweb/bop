const fp = require("fastify-plugin");
const Spotify = require("spotify-web-api-node");

const spotify = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

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
