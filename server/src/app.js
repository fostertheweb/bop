const app = require("fastify")({ logger: true });

// health check
app.get("/ping", () => "PONG");

// installed plugins
app.register(require("fastify-cors"), {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 300,
});
app.register(require("fastify-sensible"));

app.register(require("fastify-cookie"), {
  secret: "almond-milk", // we'll change this
  parseOptions: {}, // options for parsing cookies
});

// routes
app.register(require("./routes/spotify"), { prefix: "/spotify" });
app.register(require("./routes/login"), { prefix: "/login" });
app.register(require("./routes/callback"), { prefix: "/callback" });

module.exports = app;
