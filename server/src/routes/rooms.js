const { default: ShortUniqueId } = require("short-unique-id");
const { setJSON, getJSON } = require("../queue");

const BOT_NAME = "CrowdQ";

module.exports = function (app, _options, next) {
  app.get("/", async (_, reply) => {
    try {
      const ids = await app.redis.lrange("rooms", 0, -1);

      if (ids.length === 0) {
        return reply.send([]);
      }

      const commands = ids.map((id) =>
        app.redis.sendCommand(getJSON(`rooms:${id}`)),
      );
      const buffers = await Promise.all(commands);
      const rooms = buffers.map((b) => JSON.parse(b.toString()));

      return reply.send(rooms);
    } catch (err) {
      console.error(err);
    }
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
    return JSON.parse(await app.redis.sendCommand(getJSON(`rooms:${id}`)));
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

  app.get("/:id/current-playback", async ({ params: { id } }, reply) => {
    try {
      const room = JSON.parse(
        await app.redis.sendCommand(getJSON(`rooms:${id}`)),
      );
      const playback = JSON.parse(
        await app.redis.sendCommand(getJSON(`rooms:${id}:playing`)),
      );
      const guild = await app.discord().guilds.fetch(room.guild_id);
      const members = await guild.members.fetch({ query: BOT_NAME, limit: 1 });
      const [bot] = members.values();
      const connection = bot.voice.connection;
      const progress_ms = connection.dispatcher.streamTime || 0;

      console.log(playback);

      return { ...playback, progress_ms };
    } catch (err) {
      app.log.error(err);
      return reply.notFound();
    }
  });

  next();
};
