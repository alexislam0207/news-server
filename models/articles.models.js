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

exports.getAllArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
) => {
  const acceptedSortByValues = [
    "articles_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
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
  let index = 1;

  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
    index++;
  }

  let sort_byStr = sort_by;
  if (sort_by !== "comment_count") {
    sort_byStr = "a." + sort_by;
  }

  queryStr += `GROUP BY a.article_id
      ORDER BY ${sort_byStr} ${order.toUpperCase()} 
      LIMIT $${index} OFFSET $${index + 1}`;

  queryValues.push(limit);
  queryValues.push(limit * (p - 1));

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

exports.insertArticle = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;

  let queryStr = `
  INSERT INTO articles (author, title, body, topic) 
  VALUES ($1, $2, $3, $4) 
  RETURNING *`;
  const queryValues = [author, title, body, topic];

  if (article_img_url) {
    queryStr = `
  INSERT INTO articles (author, title, body, topic, article_img_url) 
  VALUES ($1, $2, $3, $4, $5) 
  RETURNING *`;
    queryValues.push(article_img_url);
  }

  return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
      return db.query(
        `
    SELECT a.article_id, a.title, a.author, a.body, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
    FROM articles AS a LEFT JOIN comments AS c 
    ON a.article_id=c.article_id 
    WHERE a.article_id = $1 
    GROUP BY a.article_id
  `,
        [rows[0].article_id]
      );
    })
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
