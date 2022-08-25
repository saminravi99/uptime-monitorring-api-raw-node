//dependecies

//module scaffolding
const handler = {};

handler.methodValidator = (methodString) => {
  let acceptedMethods = ["post", "get", "put", "delete"];

  if (acceptedMethods.indexOf(methodString) > -1) {
    return true;
  }
  return false;
};

//export module
module.exports = handler;
