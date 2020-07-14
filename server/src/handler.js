const lambda = require("aws-lambda-fastify");
const app = require("./app");
const handler = lambda(app, { callbackWaitsForEmptyEventLoop: false });

module.exports = { handler };
