const fs = require("fs/promises");

exports.getAllEndpoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then((res) => {
    return JSON.parse(res);
  });
};
