//dependecies

const { methodValidator } = require("./methodHandlers/methodValidator");

//module scaffolding
const handler = {};

handler.chosenHandler = (chosenRoute, requestedProperties, res) => {
  chosenRoute(requestedProperties, (statusCode, payload) => {
    //validate statusCode if not valid then set to 500
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    //validate payload if not valid then set to an empty object
    payload = typeof payload === "object" ? payload : {};

    if (methodValidator(requestedProperties.methodString)) {
      if (statusCode === 500) {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(500);
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      } else {
        const payloadString = JSON.stringify(payload);
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(payloadString);
      }
    } else {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(405);
      res.end(JSON.stringify({ message: "Method not allowed" }));
    }
  });
};

//export module
module.exports = handler;
