const app = require("./app");
const { MessageEmbed, Client } = require("discord.js");
const client = new Client();
const spdl = require("spdl-core").default;
const { default: ShortUniqueId } = require("short-unique-id");
const Redis = require("ioredis");

spdl.setCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET,
);

function setJSON(key, value) {
  return new Redis.Command("JSON.SET", [key, ".", JSON.stringify(value)]);
}

function getJSON(key) {
  return new Redis.Command("JSON.GET", [key]);
}

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
});

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
          .setTitle(`New CrowdQ Room Created`)
          .setColor("#8B5CF6")
          .setThumbnail(host.avatar_url)
          .addField("Host", host.username)
          .addField(
            "Room",
            `[crowdq.fm/${room.id}](${WEB_URL}/rooms/${room.id}/search)`,
            true,
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

  app.log.info(`API server listening`);

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

      connection
        .play(await spdl(payload.data.external_urls.spotify))
        .on("error", (e) => console.error(e));
      console.log("[PLAYING] - ", payload.data.name);
    });
  });
});
