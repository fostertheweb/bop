const lambda = require("aws-lambda-fastify");
const app = require("./app");
const handler = lambda(app, { callbackWaitsForEmptyEventLoop: false });
const messages = require("./messages");

module.exports = { handler, messages };
