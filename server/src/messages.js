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
    const length = await redis.llen(`${room}:listeners`);
    const listeners = await redis.lrange(`${room}:listeners`, 0, length);
    const messages = listeners.map((connectionId) =>
      send(connectionId, payload),
    );

    await Promise.all(messages);
  }

  try {
    switch (action) {
      case "CREATE_ROOM":
        await redis.lpush("rooms", room);
        break;
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
        console.log({ action, room, username, data });
        break;
    }
  } catch (err) {
    console.error(err);
  }
  return {
    statusCode: 200,
  };
};
