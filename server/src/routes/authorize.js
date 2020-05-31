const fetch = require("node-fetch");

const clientCredentials = process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;
const token = Buffer.from(clientCredentials).toString("base64");

module.exports = function(app, _options, next) {
  const url = `https://accounts.spotify.com/api/token`;

  app.get("/", async () => {
    app.log.info("POST /spotify");

    try {
      const response = await fetch(url, {
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

  next();
};
