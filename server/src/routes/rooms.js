module.exports = function (app, _options, next) {
  app.get("/", async () => {
    // app.redis.hget("")
  });

  app.get("/:room/listeners", async () => {
    // app.redis.lget(`${room}:listeners`)
  });

  app.get("/:room/queue", async () => {
    // app.redis.lget(`${room}:queue`)
  });

  next();
};
