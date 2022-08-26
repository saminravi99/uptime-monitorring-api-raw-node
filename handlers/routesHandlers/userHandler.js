//dependecies
const { hashPassword } = require("../../helpers/utilities");
const data = require("../../lib/data");

const { methodValidator } = require("../methodHandlers/methodValidator");

//module scaffolding
const handler = {};

handler.userHandler = (requestedProperties, callback) => {
  //method validate
  if (methodValidator(requestedProperties.methodString)) {
    handler._user[requestedProperties.methodString](
      requestedProperties,
      callback
    );
  } else {
    callback(405, { message: "Method not allowed" });
  }
};

handler._user = {};
//function to create a new user
handler._user.post = (requestedProperties, callback) => {
  const { payload } = requestedProperties;
  const { firstName, lastName, email, password, tosAgrement } = payload;
  //validating the payloads
  const fName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : false;

  const lName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : false;

  const userEmail =
    typeof email === "string" && email.trim().length > 0 ? email.trim() : false;

  const userPassword =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;

  const userTosAgrement =
    typeof tosAgrement === "boolean" && tosAgrement === true ? true : false;
  //if all the payloads are valid then create a new user
  if (fName && lName && userEmail && userPassword && userTosAgrement) {
    //check if the user already exists in the database
    data.read("users", userEmail, (err) => {
      if (!err) {
        callback(400, { message: "User already exists" });
      } else {
        const userObject = {
          firstName: fName,
          lastName: lName,
          email: userEmail,
          password: hashPassword(userPassword),
          tosAgrement: userTosAgrement,
        };
        //create a new user
        data.create("users", userEmail, userObject, (err) => {
          if (!err) {
            callback(200, { message: "User created successfully" });
          } else {
            callback(500, { message: `${err}` });
          }
        });
      }
    });
  }
};
handler._user.get = (requestedProperties, callback) => {
  const { queryStringObject } = requestedProperties;
  const { email } = queryStringObject;
  if (email) {
    data.read("users", email, (err, userData) => {
      if (!err && userData) {
        delete userData.password;
        callback(200, userData);
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(400, { message: "Missing required fields" });
  }
};
handler._user.put = (requestedProperties, callback) => {
  const { payload } = requestedProperties;
  const { email, firstName, lastName, password } = payload;
  //validating the payloads
  const userEmail =
    typeof email === "string" && email.trim().length > 0 ? email.trim() : false;

  const userFirstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : false;

  const userLastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : false;
  const userPassword =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;
  //if all the payloads are valid then update the user
  if (userEmail && (userFirstName || userLastName || userPassword)) {
    //check if the user already exists in the database
    data.read("users", userEmail, (err, userData) => {
      if (!err && userData) {
        const userObject = {
          firstName: userFirstName || userData.firstName,
          lastName: userLastName || userData.lastName,
          password: hashPassword(userPassword) || userData.password,
        };
        //update the user
        data.update("users", userEmail, userObject, (err) => {
          if (!err) {
            callback(200, { message: "User updated successfully" });
          } else {
            callback(500, { message: `${err}` });
          }
        });
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(400, { message: "Missing required fields" });
  }
};
handler._user.delete = (requestedProperties, callback) => {
  const { queryStringObject } = requestedProperties;
  const { email } = queryStringObject;
  if (email) {
    data.read("users", email, (err, userData) => {
      if (!err && userData) {
        data.delete("users", email, (err) => {
          if (!err) {
            callback(200, { message: "User deleted successfully" });
          } else {
            callback(500, { message: `${err}` });
          }
        });
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(400, { message: "Missing required fields" });
  }
};

//export module
module.exports = handler;
