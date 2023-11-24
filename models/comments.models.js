const db = require("../db/connection");

exports.getCommentsByArticeId = (article_id, limit = 10, p = 1) => {
  return db
    .query(
      `
  SELECT * FROM comments 
  WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (limit * (p - 1) > rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return db.query(
        `
    SELECT * FROM comments 
    WHERE article_id = $1 
    LIMIT $2 OFFSET $3`,
        [article_id, limit, limit * (p - 1)]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `
    INSERT INTO comments(body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateComment = (comment_id, updateVote) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *`,
      [updateVote.inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};
