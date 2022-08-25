//dependecies
const { parseRequest, handlePayload } = require("./utilities");
const { StringDecoder } = require("string_decoder");
const { notFound } = require("../handlers/routesHandlers/notFoundHandler");
const routes = require("../routes");
const { chosenHandler } = require("../handlers/chosenHandler");
const { methodHandler } = require("../handlers/methodHandlers/methodHandler");

//module scaffoliding
const helpers = {};

//handler request and response
helpers.handleReqRes = (req, res) => {
  const requestedProperties = parseRequest(req);

  //choosing the routes
  const chosenRoute =
    typeof routes[requestedProperties.trimmedPathName] !== "undefined"
      ? routes[requestedProperties.trimmedPathName]
      : notFound;

  // get payload body if any
  const decoder = new StringDecoder("utf-8");
  let realData = "";
  req
    .on("data", (bufferData) => {
      realData += decoder.write(bufferData);
    })
    .on("end", () => {
      realData += decoder.end();

      //passing realData into requestedProperties object as payload
      methodHandler(requestedProperties, realData)

      chosenHandler(chosenRoute, requestedProperties, res);
    });
};

//export module
module.exports = helpers;
