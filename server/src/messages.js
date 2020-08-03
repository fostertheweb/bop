const { ApiGatewayManagementApi } = require("aws-sdk");
const Redis = require("ioredis");

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
});

module.exports = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { action, room, data, username } = JSON.parse(event.body);
  const { domainName, stage, connectionId } = event.requestContext;
  const apigwMgmtApi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: `${domainName}/${stage}`,
  });

  async function send(connectionId, payload) {
    await apigwMgmtApi
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      })
      .promise();
  }

  async function broadcast(room, payload) {
    const listeners = await redis.lget(`${room}:listeners`);
    const messages = listeners.map((connectionId) =>
      send(connectionId, payload),
    );

    await Promise.all(messages);
  }

  switch (action) {
    case "JOIN":
      await redis.lpush(`${room}:listeners`, connectionId);
      break;
    case "ADD_TO_QUEUE":
      await redis.lpush(`${room}:queue`, JSON.stringify(data));
      await broadcast(room, {
        action: "SONG_ADDED",
        username,
        data,
      });
      break;
    default:
      console.log({ action });
      console.log({ room });
      console.log({ data });
      console.log({ username });
      break;
  }

  return {
    statusCode: 200,
  };
};
