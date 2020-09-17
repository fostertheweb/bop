const { default: ShortUniqueId } = require("short-unique-id");
const { Command } = require("ioredis");

function setJSON(key, value) {
  return new Command("JSON.SET", [key, ".", JSON.stringify(value)]);
}

function getJSON(key) {
  return new Command("JSON.GET", [key]);
}

module.exports = function (app, _options, next) {
  app.get("/", async (_, reply) => {
    const ids = await app.redis.lrange("rooms", 0, -1);
    const commands = ids.map((id) =>
      app.redis.sendCommand(getJSON(`rooms:${id}`)),
    );
    const buffers = await Promise.all(commands);
    const rooms = buffers.map((b) => JSON.parse(b.toString()));
    return reply.send(rooms || []);
  });

  app.post("/", async ({ body }, reply) => {
    try {
      const generateId = new ShortUniqueId();
      const id = generateId();
      const room = { id, ...body };
      await app.redis.lpush("rooms", id);
      await app.redis.sendCommand(setJSON(`rooms:${id}`, room));
      return reply.send(room);
    } catch (err) {
      console.error(err);
    }
  });

  app.get("/:id", async ({ params: { id } }) => {
    return await app.redis.sendCommand(getJSON(`rooms:${id}`));
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

  app.get(
    "/:id/join",
    async ({ params: { id }, query: { username } }, reply) => {
      const usernames = await app.redis.lrange(`rooms:${id}:listeners`, 0, -1);
      return usernames.includes(username) ? reply.badRequest() : reply.send([]);
    },
  );

  app.delete("/", async () => {
    await app.redis.del("rooms");
    return [];
  });

  app.delete("/:id/requests", async ({ params: { id } }) => {
    await app.redis.del(`rooms:${id}:requests`);
    return [];
  });

  next();
};
