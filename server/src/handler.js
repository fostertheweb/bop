const lambda = require("aws-lambda-fastify");
const app = require("./app");
const handler = lambda(app, { callbackWaitsForEmptyEventLoop: false });

const { ApiGatewayManagementApi } = require("aws-sdk");

const messages = async (event) => {
  const { data } = JSON.parse(event.body);
  const { domainName, stage, connectionId } = event.requestContext;
  const apigwMgmtApi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: `${domainName}/${stage}`,
  });

  await apigwMgmtApi
    .postToConnection({
      ConnectionId: connectionId,
      Data: data,
    })
    .promise();

  return {
    statusCode: 200,
  };
};

module.exports = { handler, messages };
