const app = require("./app");

process.on("warning", console.warn);

app.listen(process.env.PORT, function (err) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.io.on("connection", (socket) => {
    const roomId = socket.handshake.query.room_id;
    socket.join(roomId);

    socket.on("ADD_TO_QUEUE", async (trackId) => {
      await app.redis.rpush(`rooms:${roomId}:queue`, trackId);
      app.io.to(roomId).emit("QUEUE_UPDATED");
    });

    socket.on("REMOVE_FROM_QUEUE", async (trackId) => {
      await app.redis.lrem(`rooms:${roomId}:queue`, 0, trackId);
      app.io.to(roomId).emit("QUEUE_UPDATED");
    });
  });
});
