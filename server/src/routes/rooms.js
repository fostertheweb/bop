const { default: ShortUniqueId } = require("short-unique-id");

module.exports = function (app, _options, next) {
  app.get("/", async () => {
    const ids = await app.redis.lrange("rooms", 0, -1);
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
    const ids = await app.redis.lrange(`rooms:${id}:listeners`, 0, -1);
    return ids;
  });

  app.get("/:id/queue", async ({ params: { id } }) => {
    const queue = await app.redis.lrange(`rooms:${id}:queue`, 0, -1);
    return queue.map((i) => JSON.parse(i));
  });

  app.get("/:id/requests", async ({ params: { id } }) => {
    const requests = await app.redis.lrange(`rooms:${id}:requests`, 0, -1);
    return requests.map((i) => JSON.parse(i));
  });

  app.post(
    "/:id/check-username",
    async ({ params: { id }, body: { username } }, reply) => {
      const usernames = await app.redis.lrange(`rooms:${id}:listeners`, 0, -1);
      const isTaken = usernames.includes(username);
      return isTaken ? reply.badRequest() : reply.send([]);
    },
  );

  app.delete("/", async () => {
    await app.redis.ltrim("rooms", 0, -1);
    return [];
  });

  app.delete("/:id/requests", async ({ params: { id } }) => {
    await app.redis.ltrim(`rooms:${id}:requests`, 0, -1);
    return [];
  });

  next();
};
