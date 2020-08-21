const app = require("./app");
const Redis = require("ioredis");

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
});

app.register(require("fastify-websocket"), {
  clientTracking: true,
});

let clients = {};

app.get("/", { websocket: true }, (connection) => {
  connection.socket.on("message", async (message) => {
    const { action, room, data, username } = JSON.parse(message);

    async function send(socket, payload) {
      await socket.send(JSON.stringify(payload));
    }

    async function broadcast(room, payload) {
      const sockets = clients[room];
      const messages = sockets.map((socket) => send(socket, payload));
      await Promise.all(messages);
    }

    async function joinRoom(roomId) {
      try {
        if (Array.isArray(clients[roomId])) {
          clients[roomId] = [...clients[roomId], connection.socket];
        } else {
          clients[roomId] = [connection.socket];
        }
        // TODO: yo
        await redis.lpush(`rooms:${roomId}:listeners`, username);
        console.log(`${username} joined ${roomId}`);
      } catch (err) {
        console.error(err);
      }
    }

    async function addToQueue() {
      try {
        await redis.lpush(`rooms:${room}:queue`, JSON.stringify(data));
        console.log(`${username} added ${data.id} to ${room} queue`);
      } catch (err) {
        console.error(err);
      }
    }

    async function addSongRequest() {
      try {
        await redis.lpush(`rooms:${room}:requests`, JSON.stringify(data));
        // TODO: just track id
        await redis.lpush(
          `listeners:${username}:requests`,
          JSON.stringify(data),
        );
        console.log(`${username} requested ${data.id} in ${room}`);
      } catch (err) {
        console.error(err);
      }
    }

    switch (action) {
      case "JOIN":
        await joinRoom(room);
        break;
      case "SONG_REQUEST":
        await addSongRequest();
        await broadcast(room, {
          action: "SONG_REQUEST",
          username,
          data,
        });
        break;
      case "ADD_TO_QUEUE":
        await addToQueue();
        await broadcast(room, {
          action: "SONG_ADDED",
          username,
          data,
        });
        break;
      default:
        console.log({ action, room, username, data });
        break;
    }
  });
});

app.listen(4000, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`API server listening on ${address}`);
});
