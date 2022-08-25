//dependecies
const fs = require("fs");
const path = require("path");
const { parseJsonToObject } = require("../helpers/parseJSON");

//module scaffolding
const data = {};

//base directory of data folder
data.baseDir = path.join(__dirname, "/../.data/");

//write data to file
// dir means which subfolder to write the data to
// file is the name of the file to write to
// data is the data to write to the file
// callback is the function to call when the operation is complete
data.create = (dir, file, data, callback) => {
  fs.open(
    `${data.baseDir}${dir}/${file}.json`,
    "wx",
    (err1, fileDescriptor) => {
      if (!err1 && fileDescriptor) {
        fs.writeFile(fileDescriptor, JSON.stringify(data), (err2) => {
          if (!err2) {
            fs.close(fileDescriptor, (err3) => {
              if (!err3) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exist");
      }
    }
  );
};

//read data from file
// dir is the subfolder to read the data from
// file is the name of the file to read from
// callback is the function to call when the operation is complete
data.read = (dir, file, callback) => {
  fs.readFile(`${data.baseDir}${dir}/${file}.json`, "utf8", (err, data) => {
    if (!err && data) {
      const parsedData = parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

//update data in file
// dir is the subfolder to read the data from
// file is the name of the file to read from
// data is the data to update the file with
// callback is the function to call when the operation is complete
data.update = (dir, file, data, callback) => {
  fs.open(
    `${data.baseDir}${dir}/${file}.json`,
    "r+",
    (err1, fileDescriptor) => {
      if (!err1 && fileDescriptor) {
        fs.truncate(fileDescriptor, (err2) => {
          if (!err2) {
            fs.writeFile(fileDescriptor, JSON.stringify(data), (err3) => {
              if (!err3) {
                fs.close(fileDescriptor, (err4) => {
                  if (!err4) {
                    callback(false);
                  } else {
                    callback("Error closing existing file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Could not open file for updating, it may not exist yet");
      }
    }
  );
};

//delete data from file
// dir is the subfolder to read the data from
// file is the name of the file to read from
// callback is the function to call when the operation is complete
data.delete = (dir, file, callback) => {
  fs.unlink(`${data.baseDir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

//export module
module.exports = data;
