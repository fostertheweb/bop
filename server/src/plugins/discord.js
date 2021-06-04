const fp = require("fastify-plugin");
const { default: ShortUniqueId } = require("short-unique-id");
const { removeJSON, setJSON } = require("../shared/helpers");
const Eris = require("eris");

const discord = new Eris(process.env.DISCORD_BOT_TOKEN);
const newRoomId = new ShortUniqueId();
const COMMAND = "📻"; // process.env.BOT_COMMAND
const WEB_URL = "https://crowdq.fm";
const CDN = "https://cdn.discordapp.com";

module.exports = fp(async function (fastify, _options) {
  try {
    discord.on("messageCreate", async (message) => {
      if (message.content === COMMAND) {
        const textChannelId = message.channel.id;
        const voiceChannelId = message.member.voiceState.channelID;
        const author = message.author;
        const guild = message.channel.guild;

        if (!voiceChannelId) {
          return client.createMessage(
            textChannelId,
            `Oops, you are not in a voice channel.`,
          );
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

        // save room details
        await fastify.redis.sendCommand(setJSON(`rooms:${room.id}`, room));

        return discord.createMessage(textChannelId, {
          embed: {
            title: "Add Songs to the Play Queue",
            thumbnail: { url: host.avatar_url },
            color: 3066993,
            fields: [
              {
                name: "Hosted by",
                value: host.username,
              },
              {
                name: "Room Link",
                value: `[crowdq.fm/rooms/${room.id}](${WEB_URL}/rooms/${room.id})`,
              },
            ],
          },
        });
      }
    });

    await discord.connect();
  } catch (err) {
    fastify.log.error(err);
  }

  fastify.decorate("discord", () => discord);
});
