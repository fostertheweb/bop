const app = require("./app");

app.register(require("fastify-websocket"));

app.get("/", { websocket: true }, (connection) => {
  connection.socket.on("message", (message) => {
    console.log(message);
  });
});

app.listen(4000, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`API server listening on ${address}`);
});
