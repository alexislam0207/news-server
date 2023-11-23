const db = require("../db/connection");

exports.getArticles = (article_id) => {
  return db
    .query(
      `
        SELECT a.title, a.author, a.article_id, a.body, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
        FROM articles AS a LEFT JOIN comments AS c 
        ON a.article_id=c.article_id 
        WHERE a.article_id = $1 
        GROUP BY a.article_id
      `,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.getAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  const acceptedSortByValues = [
    "articles_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const acceptedOrderValues = ["asc", "desc"];

  if (
    !acceptedOrderValues.includes(order) ||
    !acceptedSortByValues.includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let queryStr = `SELECT a.title, a.author, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
      FROM articles AS a LEFT JOIN comments AS c 
      ON a.article_id=c.article_id `;

  const queryValues = [];

  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `GROUP BY a.article_id
      ORDER BY a.${sort_by} ${order.toUpperCase()};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (parseInt(topic) && !rows.length) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
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

exports.deleteArticle = (article_id) => {
  return db
    .query(
      `
    DELETE FROM articles 
    WHERE article_id = $1 
    RETURNING *`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};
