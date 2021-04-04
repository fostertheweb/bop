const { MessageEmbed, Client } = require("discord.js");
const spdl = require("spdl-core");

function formatDuration(duration) {
  let seconds = duration / 1000;
  return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
}

const client = new Client();

client.login("Your Discord Bot Token");
client.on("ready", () => console.log("Ready"));

client.on("message", async (msg) => {
  if (!msg.content.startsWith("!play")) return;
  const url = msg.content.split("!play ")[1];
  if (!spdl.validateURL(url)) return msg.channel.send("Invalid URL");
  const channel = msg.member.voice.channel;
  if (!channel) return msg.channel.send("Not in a voice channel");
  try {
    const connection = await channel.join();
    connection.play(await spdl(url)).on("error", (e) => console.error(e));
    const infos = await spdl.getInfo(url);
    const embed = new MessageEmbed()
      .setTitle(`Now playing: ${infos.title}`)
      .setURL(infos.url)
      .setColor("#1DB954")
      .addField(
        `Artist${infos.artists.length > 1 ? "s" : ""}`,
        infos.artists.join(", "),
        true,
      )
      .addField("Duration", formatDuration(infos.duration), true)
      .addField("Preview", `[Click here](${infos.preview_url})`, true)
      .setThumbnail(infos.thumbnail);
    msg.channel.send(embed);
  } catch (err) {
    console.error(err);
    msg.channel.send(`An error occurred: ${err.message}`);
  }
});
