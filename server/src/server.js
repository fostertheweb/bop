const app = require("./app");
const { MessageEmbed, Client } = require("discord.js");
const { default: ShortUniqueId } = require("short-unique-id");
const ytdl = require("ytdl-core");
const YouTube = require("youtube-sr").default;
const { redis, setJSON, getJSON } = require("./queue");

YouTube.set("api", process.env.YOUTUBE_API_KEY);

const client = new Client();
const newRoomId = new ShortUniqueId();

const COMMAND = "📻";
const BOT_NAME = "CrowdQ";
const WEB_URL = "http://localhost:3000"; //"https://crowdq.fm";
const CDN = "https://cdn.discordapp.com";

client.login(process.env.DISCORD_BOT_TOKEN);
client.on("ready", () => console.log("[READY]"));

client.on("message", async (message) => {
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
            `[crowdq.fm/${room.id}](${WEB_URL}/rooms/${room.id}/search)`,
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

  app.io.on("connection", (socket) => {
    socket.on("ADD_TO_QUEUE", async (payload) => {
      const guild = await client.guilds.fetch(payload.room.guild_id);
      const members = await guild.members.fetch({ query: BOT_NAME, limit: 1 });
      const [bot] = members.values();
      let connection = bot.voice.connection;

      if (!connection) {
        const channel = await client.channels.fetch(bot.voice.channelID);
        connection = await channel.join();
      }

      const { name, artists } = payload.data;
      const video = await YouTube.searchOne(`${name} ${artists[0].name}`);
      const stream = ytdl(video.url, { filter: "audioonly", dlChunkSize: 0 });
      const dispatcher = connection.play(stream);

      app.io.emit("START", {
        item: payload.data,
        duration: video.duration * 1000,
      });

      console.log("[PLAYING] - ", payload.data.name);

      dispatcher.on("finish", () => {
        console.log("[FINISHED]");
        // play next song in queue for room ID
        // shift the persisted queue
      });
    });
  });
});
