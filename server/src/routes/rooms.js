module.exports = function (app, _options, next) {
  app.post("/", async function (req, res) {
    app.log.info("POST /rooms");

    const { spotify_id } = JSON.parse(req.body);
    const room = app.io.of(`/rooms/${spotify_id}`);

    room.on("connection", socket => {
      console.log("I guess there was a connection of some sort");
    });
    room.emit("howdy fellers, let's bop");
    return res;
  });

  next();
};
