const { Client, Intents } = require("discord.js");

const client = new Client({
  ws: {
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  },
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;
