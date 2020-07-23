const app = require("fastify")({ logger: true });
const io = require("socket.io")(app.server);
const Redis = require("ioredis");

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

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

app.register(require("fastify-redis"), {
  client: redis,
});

io.on("connection", (socket) => {
  socket.join(socket.handshake.query.room, () => {
    // redis add to room:listeners list
    // send message to room saying who joined
  });

  socket.on("ADD_TO_QUEUE", function ({ data, room }) {
    // in the future would check if host allows adding without approval
    // redis.lpush(`room:${room}`, data);

    console.log({ data, room });

    socket.to(room).emit("SONG_ADDED", data);
  });

  socket.on("disconnect", function () {});
});

// routes
app.register(require("./routes/spotify"), { prefix: "/spotify" });
app.register(require("./routes/queues"), { prefix: "/queues" });
app.register(require("./routes/rooms"), { prefix: "/rooms" });

module.exports = app;
