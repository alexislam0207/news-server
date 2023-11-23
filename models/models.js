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

exports.getArticles = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles 
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.getAllArticles = (topic) => {
  let queryStr = `SELECT a.title, a.author, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
    FROM articles AS a LEFT JOIN comments AS c 
    ON a.article_id=c.article_id `;

  const queryValues = [];

  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `GROUP BY a.article_id
    ORDER BY a.created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if(parseInt(topic) && !rows.length){
        return Promise.reject({ status: 400, msg: "bad request" })
    }
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return rows;
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

exports.checkIfArticleIdExist = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
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

exports.updateArticle = (article_id, updateVote) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [updateVote.inc_votes, article_id]
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
        if(!rows.length){
            return Promise.reject({ status: 404, msg: "not found" })
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

exports.getAllUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users`
    )
    .then(({ rows }) => {
      return rows;
    });
};
