//dependecies

//module scaffolding
const environment = {};

environment.development = {
  port: 5000,
  envName: "development",
  secretKey: "calkdscasDcvdcvDAvnhfsoivgnbdfsg",
  maxChecks: 4,
};

environment.production = {
  port: 7000,
  envName: "production",
  secretKey: "adskjfbsdygaefvkodvajoeihvivw",
  maxChecks: 4,
};

const environmentToExport =
  typeof process.env.NODE_ENV === "string"
    ? environment[process.env.NODE_ENV]
    : environment.development;

//export module
module.exports = environmentToExport;
