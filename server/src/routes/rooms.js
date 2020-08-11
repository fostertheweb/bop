const { default: ShortUniqueId } = require("short-unique-id");

module.exports = function (app, _options, next) {
  app.get("/", async () => {
    const length = await app.redis.llen("rooms");
    const ids = await app.redis.lrange("rooms", 0, length);
    const hashes = ids.map((id) =>
      app.redis.hmget(`rooms:${id}`, "id", "host"),
    );
    const rooms = await Promise.all(hashes);
    return rooms;
  });

  app.post("/", async ({ body: { username } }, reply) => {
    try {
      if (!username) {
        return reply.badRequest();
      }

      const uid = new ShortUniqueId();
      const roomId = uid();
      const room = {
        id: roomId,
        host: username,
      };
      await app.redis.lpush("rooms", roomId);
      await app.redis.hmset(`rooms:${roomId}`, room);
      return room;
    } catch (err) {
      console.error(err);
    }
  });

  app.get("/:id", async ({ params: { id } }) => {
    return await app.redis.hmget(`rooms:${id}`, "id", "host");
  });

  app.get("/:room/listeners", async ({ params: { room } }) => {
    const key = `rooms:${room}:listeners`;
    const length = await app.redis.llen(key);
    const ids = await app.redis.lrange(key, 0, length);
    return ids;
  });

  app.get("/:room/queue", async ({ params: { room } }) => {
    const key = `rooms:${room}:queue`;
    const length = await app.redis.llen(key);
    const queue = await app.redis.lrange(key, 0, length);
    return queue.map((i) => JSON.parse(i));
  });

  app.delete("/", async () => {
    await app.redis.ltrim("rooms", 20, 0);
    return [];
  });

  next();
};
