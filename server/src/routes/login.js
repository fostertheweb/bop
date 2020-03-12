const querystring = require("querystring");

const client_id = process.env.SPOTIFY_CLIENT_ID;
const clientCredentials = process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;
const token = Buffer.from(clientCredentials).toString("base64");

const scope =
  "user-read-private playlist-read-private playlist-modify-public playlist-read-collaborative user-read-currently-playing user-modify-playback-state user-read-playback-state app-remote-control streaming";
const redirect_uri = "http://localhost:4000/callback/";

generateRandomString = function(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

module.exports = function(app, _options, next) {
  const url = `https://accounts.spotify.com/authorize?`;

  app.get("/", async (_, res) => {
    app.log.info("GET /login");

    const state = generateRandomString(16);
    res.setCookie(stateKey, state);
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        }),
    );
  });
  // app.get("/callback", function(req, res) {
  //   // your application requests refresh and access tokens
  //   // after checking the state parameter

  //   const code = req.query.code || null;
  //   const state = req.query.state || null;
  //   const storedState = req.cookies ? req.cookies[stateKey] : null;

  //   if (state === null || state !== storedState) {
  //     res.redirect(
  //       "/#" +
  //         querystring.stringify({
  //           error: "state_mismatch",
  //         }),
  //     );
  //   } else {
  //     res.clearCookie(stateKey);
  //     const authOptions = {
  //       url: "https://accounts.spotify.com/api/token",
  //       form: {
  //         code: code,
  //         redirect_uri: redirect_uri,
  //         grant_type: "authorization_code",
  //       },
  //       headers: {
  //         Authorization: "Basic " + token,
  //       },
  //       json: true,
  //     };

  //     request.post(authOptions, function(error, response, body) {
  //       if (!error && response.statusCode === 200) {
  //         const access_token = body.access_token,
  //           refresh_token = body.refresh_token;

  //         const options = {
  //           url: "https://api.spotify.com/v1/me",
  //           headers: { Authorization: "Bearer " + access_token },
  //           json: true,
  //         };

  //         // use the access token to access the Spotify Web API
  //         request.get(options, function(error, response, body) {
  //           console.log(body);
  //         });

  //         // we can also pass the token to the browser to make requests from there
  //         res.redirect(
  //           "/#" +
  //             querystring.stringify({
  //               access_token: access_token,
  //               refresh_token: refresh_token,
  //             }),
  //         );
  //       } else {
  //         res.redirect(
  //           "/#" +
  //             querystring.stringify({
  //               error: "invalid_token",
  //             }),
  //         );
  //       }
  //     });
  //   }
  // });
  next();
};
