//dependecies

//module scaffolding
const handler = {};

handler.notFound = (data, callback) => {
  callback(404, {
    message: "The requested resource was not found",
  });
};

//export module
module.exports = handler;
