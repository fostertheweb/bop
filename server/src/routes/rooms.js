module.exports = function (app, _options, next) {
  app.get("/", () => {
    // app.redis.hget("")
  });

  app.get("/:room", { websocket: true }, (connection, _req, { room }) => {
    connection.socket.on("message", (message) => {
      const { action, data, from } = JSON.parse(message);

      console.log({ action, room });

      switch (action) {
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
          console.log({ from });
          break;
      }
    });
  });

  app.get("/:room/listeners", () => {
    // app.redis.lget(`${room}:listeners`)
  });

  app.get("/:room/queue", () => {
    // app.redis.lget(`${room}:queue`)
  });

  next();
};
