const fp = require("fastify-plugin");
const connections = require("../shared/connections");
const { MessageEmbed } = require("discord.js");
const { default: ShortUniqueId } = require("short-unique-id");
const { setJSON } = require("../shared/helpers");
const { Client } = require("discord.js");

const newRoomId = new ShortUniqueId();
const COMMAND = "📻"; // process.env.BOT_COMMAND
const WEB_URL = "https://crowdq.fm";
const CDN = "https://cdn.discordapp.com";

module.exports = fp(function (fastify, _options, next) {
  try {
    const client = new Client();
    client.login(process.env.DISCORD_BOT_TOKEN);
    client.on(
      "message",
      async ({ content, member, channel: chat, author, guild }) => {
        if (content === COMMAND) {
          const channel = member.voice.channel;

          if (!channel) {
            return channel.send(`Oops, you are not in a voice channel.`);
          }

          const host = {
            id: author.id,
            username: author.username,
            avatar_url: `${CDN}/avatars/${author.id}/${author.avatar}.png`,
          };

          const room = {
            id: newRoomId(),
            guild_id: guild.id,
            name: guild.name,
            icon_url: `${CDN}/icons/${guild.id}/${guild.icon}.png`,
            host,
          };

          connections.create(channel, {
            onReady() {
              console.log("READY");
            },
            onDisconnect() {
              fastify.io.to(room.id).emit("BOT_DISCONNECTED");
            },
          });

          // save room details
          await fastify.redis.sendCommand(setJSON(`rooms:${room.id}`, room));

          return chat.send(
            new MessageEmbed()
              .setTitle(`New Room Created`)
              .setColor("#8B5CF6")
              .setThumbnail(host.avatar_url)
              .addField("Host", host.username)
              .addField(
                "Room",
                `[crowdq.fm/${room.id}](${WEB_URL}/rooms/${room.id})`,
              ),
          );
        }
      },
    );
  } catch (err) {
    fastify.log.error(err);
  }

  fastify.decorate("discord", () => client);
  next();
});
