const { default: ShortUniqueId } = require("short-unique-id");
const { setJSON, getJSON } = require("../shared/helpers");
const YouTube = require("youtube-sr").default;
const connections = require("../shared/connections");

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
    return await app.redis.lrange(`rooms:${id}:queue`, 0, -1);
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
      const dispatcher = connections.getAudioPlayer(room);
      const progress_ms = dispatcher.streamTime || 0;

      return { ...playback, progress_ms };
    } catch (err) {
      app.log.error(err);
      return reply.notFound();
    }
  });

  app.put("/:id/play-next", async ({ params: { id } }, reply) => {
    try {
      const room = JSON.parse(
        await app.redis.sendCommand(getJSON(`rooms:${id}`)),
      );
      const [trackId] = await app.redis.lrange(`rooms:${room.id}:queue`, 0, 0);
      const { body: track } = await app.spotify().getTrack(trackId);
      const { name, artists } = track;
      const video = await getYouTubeVideo(name, artists);
      const currentPlayback = buildCurrentPlayback(
        trackId,
        video.durationFormatted,
      );

      connections.play(room, video.url, {
        onStart() {
          app.io.to(room.id).emit("PLAYBACK_START", currentPlayback);
        },
        onFinish() {
          app.io.to(room.id).emit("PLAYBACK_END");
        },
      });

      // save current playback
      await app.redis.sendCommand(
        setJSON(`rooms:${room.id}:playing`, currentPlayback),
      );

      // remove currently playing song from queue
      await app.redis.lrem(`rooms:${room.id}:queue`, 0, trackId);

      reply.send("OK");
    } catch (err) {
      app.log.error(err);
    }
  });

  next();
};

async function getYouTubeVideo(name, artists) {
  // get youtube video url
  let video = await YouTube.searchOne(`${name} "${artists[0].name}" audio`);
  if (!video) {
    video = await YouTube.searchOne(`${name} "${artists[0].name}"`);
  }

  return video;
}

function buildCurrentPlayback(id, durationFormatted) {
  const [minutes, seconds] = durationFormatted.split(":");
  let duration = 0;

  if (!seconds) {
    duration = minutes * 1000;
  } else {
    duration = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
  }

  return {
    track_id: id,
    duration_ms: duration,
    progress_ms: 0,
  };
}
