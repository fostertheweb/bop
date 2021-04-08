const app = require("fastify")({ logger: true });
const { redis } = require("./queue");

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
app.register(require("fastify-socket.io"), {
  cors: { origin: true, methods: ["GET", "POST"] },
});
app.register(require("fastify-sensible"));
app.register(require("fastify-cookie"), {
  secret: "almond-milk", // we'll change this
  parseOptions: {}, // options for parsing cookies
});
app.register(require("fastify-redis"), {
  client: redis,
});

// routes
app.register(require("./routes/spotify"), { prefix: "/spotify" });
app.register(require("./routes/rooms"), { prefix: "/rooms" });

module.exports = app;
