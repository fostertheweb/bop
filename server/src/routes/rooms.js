module.exports = function (app, _options, next) {
  app.post("/", async function (request, reply) {
    // redis set list for user key
    // redis set session hash for user key
  });

  app.get("/", async function (request, reply) {
    // return all redis hashes
  });

  app.put("/:owner", async function (request, reply) {
    // request host to add song
  });

  next();
};
