const app = require("./app");
const { MessageEmbed } = require("discord.js");
const { default: ShortUniqueId } = require("short-unique-id");
const ytdl = require("ytdl-core");
const YouTube = require("youtube-sr").default;
const { redis, setJSON, getJSON } = require("./queue");
const discord = require("./shared/discord.js");
const util = require("util");
const Spotify = require("spotify-web-api-node");
const {
  createAudioPlayer,
  joinVoiceChannel,
  getVoiceConnection,
  createAudioResource,
  StreamType,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const spotify = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const newRoomId = new ShortUniqueId();
const COMMAND = "📻"; // process.env.BOT_COMMAND
const WEB_URL = "https://crowdq.fm";
const CDN = "https://cdn.discordapp.com";

let players = {};
let adapters = {};

discord.on("debug", console.log);

discord.on("message", async (message) => {
  try {
    if (message.content === COMMAND) {
      const channel = message.member.voice.channel;

      console.log({ channel });

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
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        selfDeaf: true,
        debug: true,
        adapterCreator: (methods) => {
          console.log({ methods });
          return {
            sendPayload(data) {
              return channel.guild.shard.send(data);
            },
            destroy() {
              return console.log("Destroy Adapter for ", channel.guild.id);
            },
          };
        },
      });

      console.log({ connection });

      await entersState(connection, VoiceConnectionStatus.Ready, 5000);

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
      app.io.to(roomId).emit("QUEUE_UPDATED");
    });

    socket.on("REMOVE_FROM_QUEUE", async (trackId) => {
      await redis.lrem(`rooms:${roomId}:queue`, 0, trackId);
      app.io.to(roomId).emit("QUEUE_UPDATED");
    });

    socket.on("PLAY_NEXT", async () => {
      try {
        const room = JSON.parse(
          await app.redis.sendCommand(getJSON(`rooms:${roomId}`)),
        );
        const [trackId] = await app.redis.lrange(`rooms:${roomId}:queue`, 0, 0);
        const { id, name, artists } = await getSpotifyTrack(trackId);
        const video = await getYouTubeVideo(name, artists);
        const currentPlayback = buildCurrentPlayback(
          id,
          video.durationFormatted,
        );

        const stream = ytdl(video.url, {
          type: "opus",
          filter: "audioonly",
          dlChunkSize: 0,
        });

        const resource = createAudioResource(stream, {
          inputType: StreamType.Opus,
        });

        let player;
        if (players[room.guild_id]) {
          player = players[room.guild_id];
        } else {
          player = createAudioPlayer();
          players[room.guild_id] = player;
        }

        const connection = getVoiceConnection(room.guild_id);

        console.log({ connection });

        if (!connection) {
          return app.io.to(roomId).emit("BOT_DISCONNECTED");
        }

        player.play(resource);

        connection.subscribe(player);

        connection.on("disconnect", () => {
          app.io.to(roomId).emit("BOT_DISCONNECTED");
        });

        connection.on("reconnecting", () => {
          app.io.to(roomId).emit("BOT_RECONNECTING");
        });

        connection.on("ready", () => {
          app.io.to(roomId).emit("BOT_READY");
        });

        await entersState(player, AudioPlayerStatus.Playing, 2500);

        // const dispatcher = connection.play(stream, { volume: false });

        // dispatcher.on("start", () => {
        //   app.io.to(roomId).emit("PLAYBACK_START", currentPlayback);
        // });

        // dispatcher.on("finish", async () => {
        //   app.io.to(roomId).emit("PLAYBACK_END");
        // });

        // save current playback
        await app.redis.sendCommand(
          setJSON(`rooms:${roomId}:playing`, currentPlayback),
        );

        // remove currently playing song from queue
        await redis.lrem(`rooms:${roomId}:queue`, 0, id);
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

async function getYouTubeVideo(name, artists) {
  // get youtube video url
  let video = await YouTube.searchOne(`${name} ${artists[0].name} audio`);
  console.log("YouTube Request");
  if (!video) {
    video = await YouTube.searchOne(`${name} ${artists[0].name}`);
    console.log("YouTube Request 2");
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
