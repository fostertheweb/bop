const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const clientCredentials = process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;
const token = Buffer.from(clientCredentials).toString("base64");

module.exports = function(app, _options, next) {
  app.get("/", async function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    const refresh_token = req.query.refresh_token || null;

    const url = "https://accounts.spotify.com/api/token";

    const params = new URLSearchParams();

    const code = req.cookies["code"];
    params.append("refresh_token", refresh_token);
    params.append("grant_type", "refresh_token");
    params.append("code", code);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: params,
        headers: { Authorization: "Basic " + token },
      });
      const body = await response.json();
      console.log({ body });
      const access_token = body.access_token;
      console.log({ access_token });
      res.send({ access_token });
    } catch (err) {
      console.error(err);
    }
  });

  next();
};
