const app = require("./app");
const { MessageEmbed } = require("discord.js");
const { default: ShortUniqueId } = require("short-unique-id");
const ytdl = require("ytdl-core");
const YouTube = require("youtube-sr").default;
const { redis, setJSON, getJSON } = require("./queue");
const discord = require("./shared/discord.js");
const util = require("util");
const Spotify = require("spotify-web-api-node");

const spotify = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

YouTube.set("api", process.env.YOUTUBE_API_KEY);

const newRoomId = new ShortUniqueId();
const COMMAND = "📻"; // process.env.BOT_COMMAND
const BOT_NAME = "CrowdQ"; // process.env.BOT_NAME
const WEB_URL = "http://localhost:3000"; // process.env.WEB_URL
const CDN = "https://cdn.discordapp.com";

discord.on("message", async (message) => {
  try {
    if (message.content === COMMAND) {
      const channel = message.member.voice.channel;

      if (!channel) {
        return message.channel.send(`Oops, you are not in a voice channel.`);
      }

      const { author, guild } = message;

      const host = {
        id: author.id,
        username: author.username,
        avatar_url: `${CDN}/avatars/${author.id}/${author.avatar}.png`,
      };

      const room = {
        id: newRoomId(),
        guild_id: guild.id,
        name: guild.name,
        icon_url: `${CDN}/icons/${guild.id}/${guild.icon}.png`,
        host,
      };

      // bot joins voice chat
      await channel.join();

      // save room details
      await redis.sendCommand(setJSON(`rooms:${room.id}`, room));

      return message.channel.send(
        new MessageEmbed()
          .setTitle(`New Room Created`)
          .setColor("#8B5CF6")
          .setThumbnail(host.avatar_url)
          .addField("Host", host.username)
          .addField(
            "Room",
            `[crowdq.fm/${room.id}](${WEB_URL}/rooms/${room.id})`,
          ),
      );
    }
  } catch (err) {
    console.error("[ERROR] - ", err);
    return message.channel.send(`Oops, ${err.message}`);
  }
});

app.listen(process.env.PORT, function (err) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  // redis debugging
  app.redis.monitor(function (err, monitor) {
    monitor.on("monitor", function (time, args) {
      console.log(time + ": " + util.inspect(args));
    });
  });

  app.io.on("connection", (socket) => {
    const roomId = socket.handshake.query.room_id;
    socket.join(roomId);

    socket.on("ADD_TO_QUEUE", async (trackId) => {
      await redis.rpush(`rooms:${roomId}:queue`, trackId);
    });

    socket.on("REMOVE_FROM_QUEUE", async (trackId) => {
      await redis.lrem(`rooms:${roomId}:queue`, 0, trackId);
    });

    socket.on("PLAY_NEXT", async () => {
      try {
        const room = JSON.parse(
          await app.redis.sendCommand(getJSON(`rooms:${roomId}`)),
        );
        const [trackId] = await app.redis.lrange(`rooms:${roomId}:queue`, 0, 0);
        const { id, name, artists } = await getSpotifyTrack(trackId);
        const video = await getYouTubeVideo(name, artists);

        const connection = await getVoiceConnection(room.guild_id);
        const stream = ytdl(video.url, {
          filter: "audioonly",
          dlChunkSize: 0,
        });
        const dispatcher = connection.play(stream);

        const currentPlayback = buildCurrentPlayback(
          id,
          video.durationFormatted,
        );
        // save current playback
        await app.redis.sendCommand(
          setJSON(`rooms:${roomId}:playing`, currentPlayback),
        );

        // remove currently playing song from queue
        await redis.lrem(`rooms:${roomId}:queue`, 0, id);

        dispatcher.on("start", () => {
          app.io.to(roomId).emit("PLAYBACK_START", currentPlayback);
        });

        dispatcher.on("finish", async () => {
          app.io.to(roomId).emit("PLAYBACK_END");
        });
      } catch (err) {
        app.log.error(err);
      }
    });
  });
});

async function getSpotifyTrack(trackId) {
  const {
    body: { access_token },
  } = await spotify.clientCredentialsGrant();
  spotify.setAccessToken(access_token);
  const { body: track } = await spotify.getTrack(trackId);
  return track;
}

async function getVoiceConnection(guildId) {
  const guild = await discord.guilds.fetch(guildId);
  const members = await guild.members.fetch({
    query: BOT_NAME,
    limit: 1,
  });
  const [bot] = members.values();
  let connection = bot.voice.connection;

  if (!connection) {
    const channel = await discord.channels.fetch(bot.voice.channelID);
    connection = await channel.join();
  }

  return connection;
}

async function getYouTubeVideo(name, artists) {
  // get youtube video url
  let video = await YouTube.searchOne(`${name} ${artists[0].name} audio`);
  if (!video) {
    video = await YouTube.searchOne(`${name} ${artists[0].name}`);
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
