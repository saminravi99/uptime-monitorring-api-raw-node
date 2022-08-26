//dependecies

const { sampleHandler } = require("./handlers/routesHandlers/sampleHandler");
const { userHandler } = require("./handlers/routesHandlers/userHandler");
const { tokenHandler } = require("./handlers/routesHandlers/tokenHandler");

//module scaffolding
const routes = {};

routes.sample = sampleHandler;
routes.user = userHandler;
routes.token = tokenHandler;

//export module
module.exports = routes;
