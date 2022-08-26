//dependecies

const { parseJsonToObject } = require("../../helpers/parseJSON");

//module scaffolding
const handler = {};

handler.methodHandler = (requestedProperties, realData) => {
  acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.methodString) > -1) {
    if (
      requestedProperties.methodString === "post" ||
      requestedProperties.methodString === "put"
    ) {
      requestedProperties.payload = parseJsonToObject(realData);
    }
  } else {
    return null;
  }
};

//export module
module.exports = handler;
