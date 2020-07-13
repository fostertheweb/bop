const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const querystring = require("querystring");

const {
  API_BASE_URL,
  CLIENT_BASE_URL,
  SPOTIFY_API_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;
const redirect_uri = `${API_BASE_URL}/spotify/callback`;
const client_uri = `${CLIENT_BASE_URL}/login`;
const clientCredentials = SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET;
const token = Buffer.from(clientCredentials).toString("base64");
const scope = [
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
  "app-remote-control",
  "streaming",
].join(" ");

module.exports = function (app, _options, next) {
  app.get("/authorize", async () => {
    app.log.info("POST /spotify/authorize");
    try {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/api/token`, {
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

  app.get("/callback", async function (req, res) {
    app.log.info("GET /spotify/callback");
    const clientUrl = `${client_uri}?code=${req.query.code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`;
    res.redirect(clientUrl);
  });

  app.get("/refresh", async function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    const refresh_token = req.query.refresh_token || null;
    const params = new URLSearchParams();
    const code = req.cookies["code"];
    params.append("refresh_token", refresh_token);
    params.append("grant_type", "refresh_token");
    params.append("code", code);

    try {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/api/token`, {
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

  app.get("/login", async (_, res) => {
    app.log.info("Redirecting to authenticate with Spotify");
    res.redirect(
      `${SPOTIFY_API_BASE_URL}/authorize?${querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri,
      })}`,
    );
  });

  app.post("/login", async function ({ body }) {
    app.log.info("POST /login");
    const params = new URLSearchParams();
    params.append("code", body.code);
    params.append("redirect_uri", body.redirect_uri);
    params.append("grant_type", "authorization_code");
    try {
      const response = await fetch(`${SPOTIFY_API_BASE_URL}/api/token`, {
        method: "POST",
        body: params,
        headers: {
          Authorization: "Basic " + token,
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
