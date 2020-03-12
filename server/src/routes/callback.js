const querystring = require("querystring");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const clientCredentials = process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;
const token = Buffer.from(clientCredentials).toString("base64");

const redirect_uri = "http://localhost:4000/callback/";

const stateKey = "spotify_auth_state";

module.exports = function(app, _options, next) {
  app.get("/", async function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    const code = req.query.code || null;
    const state = req.query.state || null;

    const storedState = req.cookies ? req.cookies[stateKey] : null;

    res.clearCookie(stateKey);

    const url = "https://accounts.spotify.com/api/token";

    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("grant_type", "authorization_code");

    try {
      const response = await fetch(url, {
        method: "POST",
        body: params,
        headers: { Authorization: "Basic " + token },
      });
      const body = await response.json();
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      res.redirect(
        "http://localhost:3000/" +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
          }),
      );
    } catch (err) {
      console.error(err);
      res.redirect(
        "http://localhost:3000/" +
          querystring.stringify({
            error: "invalid_token",
          }),
      );
    }
  });

  next();
};
