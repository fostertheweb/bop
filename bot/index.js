const { MessageEmbed, Client } = require("discord.js");
const spdl = require("spdl-core").default;
const { default: ShortUniqueId } = require("short-unique-id");

const createNewId = new ShortUniqueId();
const COMMAND = "📻";
const WEB_URL = "https://crowdq.fm";

spdl.setCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET,
);

const client = new Client();

client.login(process.env.DISCORD_BOT_TOKEN);
client.on("ready", () => console.log("[READY]"));

client.on("message", async (message) => {
  console.log("[MESSAGE] - ", message);

  const channel = message.member.voice.channel;
  if (!channel) return message.channel.send("Not in a voice channel");

  try {
    if (message.content === COMMAND) {
      await channel.join();

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
