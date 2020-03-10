const app = require("fastify")({ logger: true });

// health check
app.get("/ping", () => "PONG");

// installed plugins
app.register(require("fastify-cors"), {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAage: 300,
});
app.register(require("fastify-sensible"));

// routes
app.register(require("./routes/spotify"), { prefix: "/spotify" });

module.exports = app;
