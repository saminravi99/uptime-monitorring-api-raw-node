//dependecies

//module scaffolding
const handler = {};

handler.sampleHandler = (requestedProperties, callback) => {
  console.log(requestedProperties);
  callback(200, {
    message: "success",
    result: requestedProperties,
  });
};

//export module
module.exports = handler;
