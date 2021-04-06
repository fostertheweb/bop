const app = require("./app");
const { MessageEmbed, Client } = require("discord.js");
const client = new Client();
const spdl = require("spdl-core").default;

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
      if (!connection) {
        console.log("[CONNECTING]");
        connection = await message.member.voice.channel.join();
        console.log("[CONNECTED]");
      }

      return message.channel.send(
        new MessageEmbed()
          .setTitle("CrowdQ Room Created")
          .setURL(`${WEB_URL}/rooms/${createNewId()}`),
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
  app.log.info(`API server listening on ${address}`);

  app.io.on("connection", (socket) => {
    socket.on("message", (payload) => {
      console.log(payload);
    });

    socket.on("ADD_TO_QUEUE", async (payload) => {
      connection.play(await spdl(payload.data.external_urls.spotify));
      console.log("[PLAYING] - ", payload.data.name);
    });
  });
});
