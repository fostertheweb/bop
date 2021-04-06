const app = require("./app");
const { MessageEmbed, Client } = require("discord.js");
const client = new Client();
const spdl = require("spdl-core").default;
const { default: ShortUniqueId } = require("short-unique-id");

const createNewRoom = new ShortUniqueId();

const COMMAND = "📻";
const WEB_URL = "https://crowdq.fm";

spdl.setCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET,
);

client.login(process.env.DISCORD_BOT_TOKEN);
client.on("ready", () => console.log("[READY]"));

let connection;

client.on("message", async (message) => {
  try {
    if (message.content === COMMAND) {
      const channel = message.member.voice.channel;
      if (!channel) {
        return message.channel.send(`Oops, you are not in a voice channel.`);
      }

      if (!connection) {
        console.log("[CONNECTING]");
        connection = await channel.join();
        console.log("[CONNECTED]");
      }

      return message.channel.send(
        new MessageEmbed()
          .setTitle("CrowdQ Room Created")
          .setColor("#abc8f2")
          .addField(`[join the party](${WEB_URL}/rooms/${createNewRoom()})`),
      );
    }
  } catch (err) {
    console.error("[ERROR] - ", err);
    return message.channel.send(`Oops, ${err.message}`);
  }
});

app.listen(process.env.PORT, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`API server listening`);

  app.io.on("connection", (socket) => {
    socket.on("ADD_TO_QUEUE", async (payload) => {
      console.log("Attempting to add song.");
      connection.play(await spdl(payload.data.external_urls.spotify));
      console.log("[PLAYING] - ", payload.data.name);
    });

    socket.on("SONG_REQUEST", async (payload) => {
      console.log("Attempting to add song.");
      connection.play(await spdl(payload.data.external_urls.spotify));
      console.log("[PLAYING] - ", payload.data.name);
    });
  });
});
