//dependecies

const { sampleHandler } = require("./handlers/routesHandlers/sampleHandler");
const { userHandler } = require("./handlers/routesHandlers/userHandler");
const { tokenHandler } = require("./handlers/routesHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routesHandlers/checkHandler");

//module scaffolding
const routes = {};

routes.sample = sampleHandler;
routes.user = userHandler;
routes.token = tokenHandler;
routes.check = checkHandler;

//export module
module.exports = routes;
