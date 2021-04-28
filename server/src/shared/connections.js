const ytdl = require("ytdl-core");

let connections = new Map();
let streamDispatchers = new Map();

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
      connection.once("failed", options.onDisconnect);
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
      dispatcher.once("finish", () => {
        options.onFinish();
        stream.end();
      });
    }

    streamDispatchers.set(room.id, dispatcher);
  },

  removeConnection(guildId) {
    const connection = connections.get(guildId);

    if (connection) {
      connections.delete(guildId);
    }
  },
  removeStreamDispatcher(roomId) {
    const dispatcher = streamDispatchers.get(roomId);

    if (dispatcher) {
      dispatcher.end();
      streamDispatchers.delete(roomId);
    }
  },
};
