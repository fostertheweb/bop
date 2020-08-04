module.exports = function (app, _options, next) {
  app.get("/", async () => {
    const length = await app.redis.llen("rooms");
    const rooms = await app.redis.lrange("rooms", 0, length);

    return rooms;
  });

  app.post("/", async ({ body }) => {
    return await app.redis.lpush("rooms", body.room);
  });

  app.get("/:room", async ({ params: { room } }) => {
    return await app.redis.hget(room);
  });

  app.get("/:room/listeners", async ({ params: { room } }) => {
    const key = `${room}:listeners`;
    const length = await app.redis.llen(key);
    const ids = await app.redis.lrange(key, 0, length);

    return ids;
  });

  app.get("/:room/queue", async ({ params: { room } }) => {
    const key = `${room}:queue`;
    const length = await app.redis.llen(key);
    const queue = await app.redis.lrange(key, 0, length);

    return queue.map((i) => JSON.parse(i));
  });

  next();
};
