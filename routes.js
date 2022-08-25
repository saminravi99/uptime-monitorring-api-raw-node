//dependecies

const { sampleHandler } = require("./handlers/routesHandlers/sampleHandler");
const { userHandler } = require("./handlers/routesHandlers/userHandler");

//module scaffolding
const routes = {};

routes.sample = sampleHandler;
routes.user = userHandler;

//export module
module.exports = routes;
