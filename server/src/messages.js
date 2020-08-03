const { ApiGatewayManagementApi } = require("aws-sdk");

module.exports = async (event) => {
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
