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

      const generateId = new ShortUniqueId();
      const id = generateId();
      const room = {
        id,
        host: username,
      };
      await app.redis.lpush("rooms", id);
      await app.redis.hmset(`rooms:${id}`, room);
      return room;
    } catch (err) {
      console.error(err);
    }
  });

  app.get("/:id", async ({ params: { id } }) => {
    return await app.redis.hmget(`rooms:${id}`, "id", "host");
  });

  app.get("/:id/listeners", async ({ params: { id } }) => {
    const key = `rooms:${id}:listeners`;
    const length = await app.redis.llen(key);
    const ids = await app.redis.lrange(key, 0, length);
    return ids;
  });

  app.get("/:id/queue", async ({ params: { id } }) => {
    const key = `rooms:${id}:queue`;
    const length = await app.redis.llen(key);
    const queue = await app.redis.lrange(key, 0, length);
    return queue.map((i) => JSON.parse(i));
  });

  app.post(
    "/:id/check-username",
    async ({ params: { id }, body: { username } }, reply) => {
      const key = `rooms:${id}:listeners`;
      const length = await app.redis.llen(key);
      const usernames = await app.redis.lrange(key, 0, length);
      const isTaken = usernames.includes(username);
      return isTaken ? reply.badRequest() : reply.send([]);
    },
  );

  app.delete("/", async () => {
    await app.redis.ltrim("rooms", 20, 0);
    return [];
  });

  next();
};
