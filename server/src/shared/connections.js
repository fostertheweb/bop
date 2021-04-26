const ytdl = require("ytdl-core");

let connections = new Map();
let streamDispatchers = new Map();

// const guild = await discord.guilds.fetch(room.guild_id);
// const member = await guild.members.fetch(room.host.id);
// const channel = member.voice.channel;

module.exports = {
  getStreamDispatcher(room) {
    return streamDispatchers.get(room.id);
  },
  async create(channel, options) {
    const connection = await channel.join();
    connection.setSpeaking("SOUNDSHARE");
    connection.voice.setDeaf(true);

    if (options.onDisconnect) {
      connection.once("disconnect", options.onDisconnect);
    }

    if (options.onReconnecting) {
      connection.once("reconnecting", options.onReconnecting);
    }

    if (options.onReady) {
      connection.once("ready", options.onReady);
    }

    connections.set(channel.guild.id, connection);
  },

  play(room, url, options) {
    const connection = connections.get(room.guild_id);

    const stream = ytdl(url, {
      type: "opus",
      filter: "audioonly",
      dlChunkSize: 0,
    });

    // play song
    const dispatcher = connection.play(stream, { volume: false });

    if (options.onStart) {
      dispatcher.once("start", options.onStart);
    }

    if (options.onFinish) {
      dispatcher.once("finish", options.onFinish);
    }

    streamDispatchers.set(room.id, dispatcher);
  },

  removeStreamDispatcher(room) {
    streamDispatchers.delete(room.id);
  },
};
