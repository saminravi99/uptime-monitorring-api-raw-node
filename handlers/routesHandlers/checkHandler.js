//dependecies
const { hashPassword, generateToken } = require("../../helpers/utilities");
const data = require("../../lib/data");
const { _token } = require("./tokenHandler");
const { methodValidator } = require("../methodHandlers/methodValidator");
const environment = require("../../helpers/environment");

//destructuring veriFyToken function from _token
const { verifyToken } = _token;

//module scaffolding
const handler = {};

handler.checkHandler = (requestedProperties, callback) => {
  //method validate
  if (methodValidator(requestedProperties.methodString)) {
    handler._check[requestedProperties.methodString](
      requestedProperties,
      callback
    );
  } else {
    callback(405, { message: "Method not allowed" });
  }
};

handler._check = {};
//function to create a new user
handler._check.post = (requestedProperties, callback) => {
  const { payload, headersObject } = requestedProperties;
  const { protocol, url, method, successCodes, timeoutSeconds } = payload;

  //validating the payloads
  //user given protocol
  const userProtocol =
    typeof protocol === "string" && ["http", "https"].indexOf(protocol) > -1
      ? protocol
      : false;

  //user given url
  const userUrl =
    typeof url === "string" && url.trim().length > 0 ? url : false;

  //user given method
  const userMethod =
    typeof method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(method.toUpperCase()) > -1
      ? method
      : false;

  //user given success codes
  const userSuccessCodes = successCodes instanceof Array ? successCodes : false;
  //user given timeout seconds
  const userTimeoutSeconds =
    typeof timeoutSeconds === "number" &&
    timeoutSeconds > 0 &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;
  //if all the payloads are valid go forward
  console.log({
    userProtocol,
    userUrl,
    userMethod,
    userSuccessCodes,
    userTimeoutSeconds,
  });
  if (
    userProtocol &&
    userUrl &&
    userMethod &&
    userSuccessCodes &&
    userTimeoutSeconds
  ) {
    //check  authentication token
    const token =
      typeof headersObject.token === "string" ? headersObject.token : false;
    if (token) {
      //check associated email with the token
      data.read("tokens", token, (err, tokenData) => {
        if (!err && tokenData) {
          const userEmail = tokenData.email;
          //check if the user email is associated with the token
          data.read("users", userEmail, (err, userData) => {
            if (!err && userData) {
              verifyToken(token, userEmail, (tokenIsValid) => {
                if (tokenIsValid) {
                  let userChecks =
                    userData.checks instanceof Array ? userData.checks : [];

                  if (userChecks.length <= environment.maxChecks) {
                    const checkId = generateToken(30);
                    const checkObject = {
                      id: checkId,
                      email: userEmail,
                      protocol,
                      url,
                      method,
                      successCodes,
                      timeoutSeconds,
                    };
                    userChecks.push(checkId);
                    userData.checks = userChecks;
                    data.create("checks", checkId, checkObject, (err) => {
                      if (!err) {
                        data.update("users", userEmail, userData, (err) => {
                          if (!err) {
                            callback(200, checkObject);
                          } else {
                            callback(500, { message: `${err}`, error: true });
                          }
                        });
                      } else {
                        callback(500, {
                          error: `${err} `,
                          message: "Could not create the check",
                        });
                      }
                    });
                  } else {
                    callback(401, {
                      message: "User already has the maximum number of checks",
                    });
                  }
                } else {
                  callback(403, { message: "Forbidden" });
                }
              });
            } else {
              callback(403, { message: "Forbidden" });
            }
          });
        } else {
          callback(403, { message: "Forbidden" });
        }
      });
    } else {
      callback(403, { message: "Forbidden" });
    }
  } else {
    callback(400, { message: "Missing required fields" });
  }
};
//Authenticated with token
handler._check.get = (requestedProperties, callback) => {
  const { queryStringObject, headersObject } = requestedProperties;
  const { token } = headersObject;
  const { checkId } = queryStringObject;

  const id =
    typeof checkId === "string" && checkId.trim().length === 30
      ? checkId
      : false;
  console.log(checkId);

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        verifyToken(token, checkData.email, (tokenIsValid) => {
          if (tokenIsValid) {
            callback(200, checkData);
          } else {
            callback(403, { message: "Forbidden Mula" });
          }
        });
      } else {
        callback(404, { message: "Check Id not found" });
      }
    });
  } else {
    callback(403, { message: "Forbidden kula" });
  }
};
//Authenticated with token
handler._check.put = (requestedProperties, callback) => {
  const { payload, headersObject } = requestedProperties;

  const { checkId, protocol, url, method, successCodes, timeoutSeconds } =
    payload;
  //validating the payloads
  //user given protocol
  const userProtocol =
    typeof protocol === "string" && ["http", "https"].indexOf(protocol) > -1
      ? protocol
      : false;

  //user given url
  const userUrl =
    typeof url === "string" && url.trim().length > 0 ? url : false;

  //user given method
  const userMethod =
    typeof method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(method.toUpperCase()) > -1
      ? method
      : false;

  //user given success codes
  const userSuccessCodes = successCodes instanceof Array ? successCodes : false;
  //user given timeout seconds
  const userTimeoutSeconds =
    typeof timeoutSeconds === "number" &&
    timeoutSeconds > 0 &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;
  //if all the payloads are valid go forward
  console.log({
    userProtocol,
    userUrl,
    userMethod,
    userSuccessCodes,
    userTimeoutSeconds,
  });

  const { token } = headersObject;
  const id =
    typeof checkId === "string" && checkId.trim().length === 30
      ? checkId
      : false;
  if (id) {
    data.read("checks", id, (err, checkData) => {
      console.log(checkData);
      if (!err && checkData) {
        verifyToken(token, checkData.email, (tokenIsValid) => {
          console.log(tokenIsValid);
          if (tokenIsValid) {
            if (
              userProtocol ||
              userMethod ||
              userUrl ||
              userSuccessCodes ||
              userTimeoutSeconds
            ) {
              const checkDataObject = {
                id,
                protocol: userProtocol || checkData.protocol,
                url: userUrl || checkData.url,
                method: userMethod || checkData.method,
                successCodes: userSuccessCodes || checkData.successCodes,
                timeoutSeconds: userTimeoutSeconds || checkData.timeoutSeconds,
                email: checkData.email,
              };
              data.update("checks", id, checkDataObject, (err) => {
                if (!err) {
                  callback(200, checkDataObject);
                } else {
                  callback(500, { message: `${err}`, error: true });
                }
              });
            } else {
              callback(400, { message: "Missing required fields" });
            }
          } else {
            callback(403, { message: "Forbidden fula", err });
          }
        });
      } else {
        callback(404, { message: "Check Id not found" });
      }
    });
  } else {
    callback(400, { message: "Missing required fields" });
  }
};
//Authenticated with token
handler._check.delete = (requestedProperties, callback) => {
  const { queryStringObject, headersObject } = requestedProperties;
  const { token } = headersObject;
  const { checkId } = queryStringObject;

  const id =
    typeof checkId === "string" && checkId.trim().length === 30
      ? checkId
      : false;
  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        verifyToken(token, checkData.email, (tokenIsValid) => {
          if (tokenIsValid) {
            data.delete("checks", id, (err) => {
              if (!err) {
                data.read("users", checkData.email, (err, userData) => {
                    if(!err && userData){
                        const userChecks = userData.checks.filter(check => check !== id);
                        const userDataObject = {
                            ...userData,
                            checks: userChecks,
                        };
                        data.update("users", checkData.email, userDataObject, (err) => {
                            if (!err) {
                            callback(200, { message: "Check deleted" });
                            } else {
                            callback(500, { message: `${err}`, error: true });
                            }
                        } );
                    }else{
                        callback(500, { message: `${err}`, err });
                    }
                })
              } else {
                callback(500, { message: `${err}`, error: true });
              }
            });
          } else {
            callback(403, { message: "Forbidden fula" });
          }
        });
      } else {
        callback(404, { message: "Check Id not found" });
      }
    }),
      (err) => {
        callback(500, { message: `${err}`, error: true });
      };
  } else {
    callback(400, { message: "Missing required fields" });
  }
};

//export module
module.exports = handler;
