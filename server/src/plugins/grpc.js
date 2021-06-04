const fp = require("fastify-plugin");

const PROTO_PATH = __dirname + "../../../proto/player.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

module.exports = fp(function (fastify, _options, next) {
  const pkgDef = protoLoader.loadSync(PROTO_PATH);
  const pkgDesc = grpc.loadPackageDefinition(pkgDef);
  const player = pkgDesc.player;

  const client = new player.PlayService(
    "[::1]:50051",
    grpc.credentials.createInsecure(),
  );

  fastify.decorate("grpc", () => client);

  next();
});
