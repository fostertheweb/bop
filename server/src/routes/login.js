const querystring = require("querystring");
const fetch = require("node-fetch");

const API_URL = "http://localhost:4000";
const CLIENT_URL = "http://localhost:3000";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const clientCredentials =
	process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET;
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
const redirect_uri = `${API_URL}/callback`;

module.exports = function (app, _options, next) {
	app.get("/", async (_, res) => {
		app.log.info("Redirecting to authenticate with Spotify");
		res.redirect(
			"https://accounts.spotify.com/authorize?" +
				querystring.stringify({
					response_type: "code",
					client_id,
					scope,
					redirect_uri,
				}),
		);
	});

	app.post("/", async function ({ body }) {
		app.log.info("POST /login");
		const url = "https://accounts.spotify.com/api/token";
		const params = new URLSearchParams();
		params.append("code", body.code);
		params.append("redirect_uri", body.redirect_uri);
		params.append("grant_type", "authorization_code");
		try {
			const response = await fetch(url, {
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
