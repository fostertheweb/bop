const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const {
  SPOTIFY_AUTH_API_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

const clientCredentials = SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET;
const token = Buffer.from(clientCredentials).toString("base64");

module.exports = function (app, _options, next) {
  app.get("/authorize", async () => {
    app.log.info("POST /spotify/authorize");
    try {
      const response = await fetch(`${SPOTIFY_AUTH_API_BASE_URL}/api/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  app.post("/refresh", async function (req, res) {
    const refresh_token = req.body.refresh_token || null;
    const params = new URLSearchParams();
    const code = req.cookies["code"];
    console.log({ code });
    params.append("refresh_token", refresh_token);
    params.append("grant_type", "refresh_token");
    params.append("code", code);

    try {
      const response = await fetch(`${SPOTIFY_AUTH_API_BASE_URL}/api/token`, {
        method: "POST",
        body: params,
        headers: { Authorization: "Basic " + token },
      });
      const body = await response.json();
      const access_token = body.access_token;
      res.send({ access_token });
    } catch (err) {
      console.error(err);
    }
  });

  app.post("/login", async function ({ body }) {
    app.log.info("POST /login");
    const params = new URLSearchParams();
    params.append("code", body.code);
    params.append("redirect_uri", body.redirect_uri);
    params.append("grant_type", "authorization_code");
    try {
      const response = await fetch(`${SPOTIFY_AUTH_API_BASE_URL}/api/token`, {
        method: "POST",
        body: params,
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return await response.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  next();
};
