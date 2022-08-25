//dependecies
const http = require("http");
const environmentToExport = require("./helpers/environment");
const { handleReqRes } = require("./helpers/handlerReqRes");

//app object - module scaffolding
const app = {};

//configuration
app.config = {
  port: environmentToExport.port,
};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port);
  console.log(`Server is listening on port ${app.config.port}`);
};

//handle request and response
app.handleReqRes = handleReqRes;

//export module
module.exports = app;

//Start server
app.createServer();
