const db = require("../db/connection");

exports.getAllUsers = (username) => {
  let queryStr = `SELECT * FROM users `;
  const queryValues = [];
  if (username) {
    queryStr += `WHERE username = $1`;
    queryValues.push(username);
  }
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    if (username) {
      return rows[0];
    }
    return rows;
  });
};