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

const COMMAND = "📻";
const BOT_NAME = "CrowdQ";
const WEB_URL = "http://localhost:3000"; //"https://crowdq.fm";
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
        type: "DISCORD",
        username: author.username,
        avatar_url: `${CDN}/avatars/${author.id}/${author.avatar}.png`,
      };

      const room = {
        id: newRoomId(),
        type: "DISCORD",
        guild_id: guild.id,
        name: guild.name,
        icon_url: `${CDN}/icons/${guild.id}/${guild.icon}.png`,
        host,
      };

      console.log("[CONNECTING]");
      await channel.join();
      console.log("[CONNECTED]");

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
    socket.on("ADD_TO_QUEUE", async (payload) => {
      await redis.rpush(`rooms:${payload.room_id}:queue`, payload.track_id);
    });

    socket.on("REMOVE_FROM_QUEUE", async (payload) => {
      await redis.lrem(`rooms:${payload.room_id}:queue`, 0, payload.track_id);
    });

    socket.on("PLAY_SONG", async (payload) => {
      try {
        // get room details
        const room = JSON.parse(
          await app.redis.sendCommand(getJSON(`rooms:${payload.room_id}`)),
        );
        // get connection
        const guild = await discord.guilds.fetch(room.guild_id);
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

        let trackId = payload.track_id;
        if (!trackId) {
          const [nextSong] = await app.redis.lrange(
            `rooms:${payload.room_id}:queue`,
            0,
            0,
          );
          trackId = nextSong;
        }

        // get track info
        const {
          body: { access_token },
        } = await spotify.clientCredentialsGrant();
        spotify.setAccessToken(access_token);
        const { body: track } = await spotify.getTrack(trackId);
        const { id, name, artists } = track;

        // get youtube video url
        let video = await YouTube.searchOne(`${name} ${artists[0].name} audio`);
        if (!video) {
          video = await YouTube.searchOne(`${name} ${artists[0].name}`);
        }

        // play stream
        const stream = ytdl(video.url, {
          filter: "audioonly",
          dlChunkSize: 0,
        });
        const dispatcher = connection.play(stream);

        // build playback info
        // video.duration was sometimes a oddly small number
        const [minutes, seconds] = video.durationFormatted.split(":");
        const duration = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
        const currentPlayback = {
          track_id: id,
          duration_ms: duration,
          progress_ms: 0,
        };

        // remove playing song from queue
        await redis.lrem(`rooms:${room.id}:queue`, 0, id);
        // save current playback
        await app.redis.sendCommand(
          setJSON(`rooms:${room.id}:playing`, currentPlayback),
        );

        // song start
        dispatcher.on("start", () => {
          app.io.emit("PLAYBACK_START", currentPlayback);
        });

        // song end
        dispatcher.on("finish", () => {
          app.io.emit("PLAYBACK_END");
        });
      } catch (err) {
        app.log.error(err);
      }
    });
  });
});
