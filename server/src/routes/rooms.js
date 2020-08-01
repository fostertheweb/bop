module.exports = function (app, _options, next) {
  app.get("/", () => {
    // app.redis.hget("")
  });

  app.get("/:room/listeners", () => {
    // app.redis.lget(`${room}:listeners`)
  });

  app.get("/:room/queue", () => {
    // app.redis.lget(`${room}:queue`)
  });

  next();
};
