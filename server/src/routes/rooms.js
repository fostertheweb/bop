const { setJSON, getJSON, removeJSON } = require("../shared/helpers");
const YouTube = require("youtube-sr").default;
const connections = require("../shared/connections");
const { inspect } = require("util");

module.exports = function (app, _options, next) {
  app.get("/:id", async ({ params: { id } }) => {
    return JSON.parse(await app.redis.sendCommand(getJSON(`rooms:${id}`)));
  });

  app.get("/:id/listeners", async ({ params: { id } }) => {
    return await app.redis.lrange(`rooms:${id}:listeners`, 0, -1);
  });

  app.get("/:id/queue", async ({ params: { id } }) => {
    return await app.redis.lrange(`rooms:${id}:queue`, 0, -1);
  });

  app.get("/:id/requests", async ({ params: { id } }) => {
    return await app.redis.lrange(`rooms:${id}:requests`, 0, -1);
  });

  app.get(
    "/:id/join",
    async ({ params: { id }, query: { username } }, reply) => {
      const usernames = await app.redis.lrange(`rooms:${id}:listeners`, 0, -1);
      return usernames.includes(username) ? reply.badRequest() : reply.send([]);
    },
  );

  app.get("/:id/current-playback", async ({ params: { id } }, reply) => {
    try {
      const room = JSON.parse(
        await app.redis.sendCommand(getJSON(`rooms:${id}`)),
      );
      const playback = JSON.parse(
        await app.redis.sendCommand(getJSON(`rooms:${id}:playing`)),
      );
      const connection = connections.getConnection(room.guild_id);

      if (!connection || !connection.current) {
        throw new Error("No active voice connection found.");
      }

      const progress_ms = connection.current.playTime || 0;

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

      if (!trackId) {
        return reply.code(204).send(null);
      }

      const { body: track } = await app.spotify().getTrack(trackId);
      const { name, artists } = track;
      const video = await getYouTubeVideo(name, artists);
      const currentPlayback = buildCurrentPlayback(
        trackId,
        video.durationFormatted,
      );

      connections.play(room.guild_id, video.url);

      // save current playback
      await app.redis.sendCommand(
        setJSON(`rooms:${room.id}:playing`, currentPlayback),
      );

      // remove currently playing song from queue
      await app.redis.lrem(`rooms:${room.id}:queue`, 0, trackId);

      reply.send("OK");
    } catch (err) {
      app.log.error(err);
      return reply.code(204).send(null);
    }
  });

  app.put("/:id/bot-reconnect", async ({ params: { id } }, reply) => {
    try {
      const room = JSON.parse(
        await app.redis.sendCommand(getJSON(`rooms:${id}`)),
      );
      const guild = app.discord().guilds.get(room.guild_id);
      const member = guild.members.get(room.host.id);
      const voiceChannelId = member.voiceState.channelID;

      if (!voiceChannelId) {
        throw new Error("Host is not in a voice channel.");
      }

      connections.removeConnection(room.guild_id);

      connections.create(room.guild_id, voiceChannelId, {
        onStart() {
          app.io.to(room.id).emit("PLAYBACK_START");
        },
        async onFinish() {
          app.io.to(room.id).emit("PLAYBACK_END");
          await app.redis.sendCommand(removeJSON(`rooms:${room.id}:playing`));
        },
        async onDisconnect() {
          app.io.to(room.id).emit("BOT_DISCONNECTED");
          connections.removeConnection(room.guild_id);
          await app.redis.sendCommand(removeJSON(`rooms:${room.id}:playing`));
        },
      });

      return reply.send("OK");
    } catch (err) {
      app.log.error(err);
      return reply.badRequest();
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
