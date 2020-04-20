const app = require("fastify")({ logger: true });
const io = require("socket.io")(app.server);

io.on("connection", socket => {
  socket.on("join", data => {
    console.log(`${data.user} joining ${data.room}`);
    socket.join(data.room);
    // socket.broadcast.to(data.room).emit("joined", `${data.user}, joined.`);
    io.to(data.room).emit("joined", `${data.user}, joined.`);
  });

  socket.on("clap", data => {
    console.log(data);
    socket.broadcast.to(data.room).emit("clap", `${data.user}, clapped!`);
  });
});

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
app.register(require("./routes/refresh"), { prefix: "/refresh" });

module.exports = app;
