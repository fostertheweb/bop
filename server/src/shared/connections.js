const ytdl = require("ytdl-core");
const discord = require("./discord");

let connections = new Map();

module.exports = {
  getConnection(guildId) {
    return connections.get(guildId);
  },
  async create(guildId, voiceChannelId, options) {
    const connection = await discord.joinVoiceChannel(voiceChannelId);
    connection.updateVoiceState(false, true);

    if (options.onStart) {
      connection.on("start", options.onStart);
    }

    if (options.onFinish) {
      connection.on("end", options.onFinish);
    }

    if (options.onDisconnect) {
      connection.once("disconnect", options.onDisconnect);
      connection.once("failed", options.onDisconnect);
    }

    if (options.onReconnecting) {
      connection.once("reconnecting", options.onReconnecting);
    }

    if (options.onReady) {
      connection.once("ready", options.onReady);
    }

    connections.set(guildId, connection);
  },

  play(guildId, url) {
    const connection = connections.get(guildId);

    const stream = ytdl(url, {
      type: "opus",
      filter: "audioonly",
      dlChunkSize: 0,
    });

    connection.play(stream);
  },

  removeConnection(guildId) {
    const connection = connections.get(guildId);

    if (connection) {
      connections.delete(guildId);
    }
  },
};
