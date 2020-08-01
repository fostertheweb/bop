const app = require("fastify")({ logger: true });

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

// health check
app.get("/ping", () => "PONG");

// installed plugins
app.register(require("fastify-cors"), {
  origin: true,
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Content-Type",
    "X-Api-Key",
    "X-Amz-Date",
    "X-Amz-User-Agent",
    "X-Amz-Security-Token",
  ],
});
app.register(require("fastify-sensible"));
app.register(require("fastify-cookie"), {
  secret: "almond-milk", // we'll change this
  parseOptions: {}, // options for parsing cookies
});
app.register(require("fastify-redis"), {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});
app.register(require("fastify-websocket"), {
  clientTracking: true,
});

app.get("/", { websocket: true }, (connection) => {
  // app.websocketServer.clients

  connection.socket.on("message", (message) => {
    const { action, room, data, username } = JSON.parse(message);

    switch (action) {
      case "JOIN":
        console.log(`${username} joined ${room}`);
        break;
      case "ADD_TO_QUEUE":
        connection.socket.send(
          JSON.stringify({
            action: "SONG_ADDED",
            data,
          }),
        );
        break;
      default:
        console.log({ action });
        console.log({ data });
        console.log({ username });
        break;
    }
  });

  return {
    statusCode: 200,
  };
});

// routes
app.register(require("./routes/spotify"), { prefix: "/spotify" });
app.register(require("./routes/rooms"), { prefix: "/rooms" });

module.exports = app;
