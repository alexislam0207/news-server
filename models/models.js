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
      return rows;
    });
};

exports.getAllArticles = () => {
  return db
    .query(
      `
    SELECT a.title, a.author, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
    FROM articles AS a LEFT JOIN comments AS c 
    ON a.article_id=c.article_id 
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`
    )
    .then(({ rows }) => {
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

exports.updateArticle = (article_id, updateVote)=>{
    return db
    .query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
    [updateVote.inc_votes, article_id])
    .then(({rows})=>{
        return rows[0]
    })
}