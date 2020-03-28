const redirect_uri = "http://localhost:4000/callback";
const client_uri = "http://localhost:3000/login";

module.exports = function(app, _options, next) {
  app.get("/", async function(req, res) {
    app.log.info("GET /callback");
    app.log.info({ query: req.query });
    const clientUrl = `${client_uri}?code=${req.query.code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`;
    res.redirect(clientUrl);
  });

  next();
};
