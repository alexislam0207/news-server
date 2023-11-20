const db = require("../db/connection");
const fs = require("fs/promises");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.getAllEndpoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then((res) => {
    return JSON.parse(res);
  });
};

exports.getCommentsByArticeId = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments 
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
