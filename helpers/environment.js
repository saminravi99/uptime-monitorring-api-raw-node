//dependecies

//module scaffolding
const environment = {};

environment.development = {
  port: 5000,
  envName: "development",
  secretKey: "calkdscasDcvdcvDAvnhfsoivgnbdfsg",
};

environment.production = {
  port: 7000,
  envName: "production",
  secretKey: "adskjfbsdygaefvkodvajoeihvivw",
};

const environmentToExport =
  typeof process.env.NODE_ENV === "string"
    ? environment[process.env.NODE_ENV]
    : environment.development;

//export module
module.exports = environmentToExport;
