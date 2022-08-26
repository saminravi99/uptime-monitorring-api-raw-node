//dependecies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const crypto = require("crypto");
const environment = require("./environment");

//module scaffoliding
const utilities = {};

//hashPassword utility function
utilities.hashPassword = (password) => {
  const userPassword =
    typeof password === "string" && password.trim().length > 0
      ? password.trim()
      : false;

  if (userPassword) {
    const hash = crypto
      .createHmac("sha256", environment.secretKey)
      .update(userPassword)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

//handler to parse the request
utilities.parseRequest = (req) => {
  //get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  //parsed URL is an object that looks like this:
  //   {
  //   protocol: null,
  //   slashes: null,
  //   auth: null,
  //   host: null,
  //   port: null,
  //   hostname: null,
  //   hash: null,
  //   search: '?a=5',
  //   query: [Object: null prototype] { a: '5' },
  //   pathname: '/about',
  //   path: '/about?a=5',
  //   href: '/about?a=5'
  // }
  //get the pathname
  const pathName = parsedUrl.pathname;
  const trimmedPathName = pathName.replace(/^\/+|\/+$/g, "");

  //get the query string as an object
  const queryStringObject = parsedUrl.query;

  //get the headers as an object
  const headersObject = req.headers;

  //get request method
  const methodString = req.method.toLowerCase();

  //passing all rrequested properties in an object
  const requestedProperties = {
    trimmedPathName,
    queryStringObject,
    headersObject,
    methodString,
  };
  //   console.log(requestedProperties);
  return requestedProperties;
};

//export module
module.exports = utilities;
