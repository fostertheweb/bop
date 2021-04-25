module.exports = class ConnectionsManager {
  connections = new Map();

  async create(channel) {
    connections.set('guildid', await channel.join())
  }
}
