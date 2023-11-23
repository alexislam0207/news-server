const express = require("express");
const {
  pathNotFound,
  getAllApiTopics,
  getAllApiEndpoints,
  getApiArticles,
  getAllApiArticles,
  getApiCommentsByArticleId,
  insertApiComment,
  updateApiArticle,
  deleteApiComment,
  getAllApiUsers,
  updateApiComment,
} = require("./controllers/controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./error");

const app = express();
app.use(express.json());

// /api
app.get("/api", getAllApiEndpoints);

// /api/topics
app.get("/api/topics", getAllApiTopics);

// /api/articles
app.get("/api/articles", getAllApiArticles);
app
  .route("/api/articles/:article_id")
  .get(getApiArticles)
  .patch(updateApiArticle);
app
  .route("/api/articles/:article_id/comments")
  .get(getApiCommentsByArticleId)
  .post(insertApiComment);

// /api/users
app.get("/api/users", getAllApiUsers);
app.get("/api/users/:username", getAllApiUsers);

// /api/comments
app
  .route("/api/comments/:comment_id")
  .patch(updateApiComment)
  .delete(deleteApiComment);

app.all("*", pathNotFound);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
