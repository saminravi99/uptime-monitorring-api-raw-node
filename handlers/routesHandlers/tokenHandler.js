//dependecies
const { parseJsonToObject } = require("../../helpers/parseJSON");
const { hashPassword, generateToken } = require("../../helpers/utilities");
const data = require("../../lib/data");

const { methodValidator } = require("../methodHandlers/methodValidator");

//module scaffolding
const handler = {};

handler.tokenHandler = (requestedProperties, callback) => {
  //method validate
  if (methodValidator(requestedProperties.methodString)) {
    handler._token[requestedProperties.methodString](
      requestedProperties,
      callback
    );
  } else {
    callback(405, { message: "Method not allowed" });
  }
};

handler._token = {};
//function to create a new user
handler._token.post = (requestedProperties, callback) => {
  const { payload } = requestedProperties;
  const { email, password } = payload;
  //validating the payloads

  const userEmail =
    typeof email === "string" && email.trim().length > 0 ? email.trim() : false;

  const userPassword =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;

  //if all the payloads are valid then create a new user
  if (userEmail && userPassword) {
    //check if the user already exists in the database
    data.read("users", userEmail, (err, userData) => {
      if (!err && userData) {
        let passwordHashed = hashPassword(userPassword);
        if (passwordHashed === userData.password) {
          let token = generateToken(30);
          let expTime = Date.now() + 60 * 60 * 1000; //1 hour
          let tokenObject = {
            email: userEmail,
            token,
            expTime,
          };

          //create a new token
          data.create("tokens", token, tokenObject, (err) => {
            if (!err) {
              callback(200, { message: "Token created successfully" });
            } else {
              callback(500, { message: `${err}` });
            }
          });
        } else {
          callback(400, { message: "Password is incorrect" });
        }
      } else {
        callback(400, { message: "User already exists" });
      }
    });
  }
};
handler._token.get = (requestedProperties, callback) => {
  const { queryStringObject } = requestedProperties;
  const { email } = queryStringObject;
  if (email) {
    data.read("users", email, (err, userData) => {
      if (!err && userData) {
        callback(200, userData);
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(400, { message: "Missing required fields" });
  }
};
handler._token.put = (requestedProperties, callback) => {
  const { payload, headersObject } = requestedProperties;
  const { email, password } = payload;
  //validating the payloads

  const userEmail =
    typeof email === "string" && email.trim().length > 0 ? email.trim() : false;

  const userPassword =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;

  const token =
    typeof headersObject.token === "string" ? headersObject.token : false;

  //if all the payloads are valid then create a new user
  if (userEmail && userPassword && token) {
    //check if the token exists in the database and then check if the token expired or not then check id the user exists in database then extend the time of token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.expTime > Date.now()) {
          data.read("users", userEmail, (err, userData) => {
            if (!err && userData) {
              let passwordHashed = hashPassword(userPassword);
              if (passwordHashed === userData.password) {
                let expTime = Date.now() + 60 * 60 * 1000; //extend 1 hour
                let tokenObject = {
                  email: userEmail,
                  token: tokenData.token,
                  expTime,
                };

                //update the token
                data.update("tokens", token, tokenObject, (err) => {
                  if (!err) {
                    callback(200, { message: "Token updated successfully" });
                  } else {
                    callback(500, { message: `${err}` });
                  }
                });
              } else {
                callback(400, { message: "Password is incorrect" });
              }
            } else {
              callback(400, { message: "User already exists" });
            }
          });
        } else {
          callback(400, { message: "Token expired" });
        }
      } else {
        callback(400, { message: "Token not found" });
      }
    });
  }
};
handler._token.delete = (requestedProperties, callback) => {
  const { headersObject } = requestedProperties;
  const { token } = headersObject;
  if (token) {
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", token, (err) => {
          if (!err) {
            callback(200, { message: "Token deleted successfully" });
          } else {
            callback(500, { message: `${err}` });
          }
        });
      } else {
        callback(404, { message: "Token not found" });
      }
    });
  } else {
    callback(400, { message: "Missing required fields" });
  }
};
//normal function to verify token
handler._token.verifyToken = (token, email, callback) => {
  data.read("tokens", token, (err, tokenData) => {
    if (!err && tokenData) {
      if (tokenData.email === email && tokenData.expTime > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

//export module
module.exports = handler;
