const ytdl = require("ytdl-core");

let connections = new Map();
let audioPlayers = new Map();

// const guild = await discord.guilds.fetch(room.guild_id);
// const member = await guild.members.fetch(room.host.id);
// const channel = member.voice.channel;

module.exports = {
  getAudioPlayer(room) {
    return audioPlayers.get(room.guild_id);
  },
  async create(channel, options) {
    const connection = await channel.join();
    connection.setSpeaking("SOUNDSHARE");
    connection.voice.setDeaf(true);

    if (options.onDisconnect) {
      connection.on("disconnect", options.onDisconnect);
    }

    if (options.onReconnecting) {
      connection.on("reconnecting", options.onReconnecting);
    }
    if (options.onReady) {
      connection.on("ready", options.onReady);
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
      dispatcher.on("start", options.onStart);
    }

    if (options.onFinish) {
      dispatcher.on("finish", options.onFinish);
    }

    audioPlayers.set(room.guild_id, dispatcher);
  },
};
