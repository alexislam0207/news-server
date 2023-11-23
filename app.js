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
app.get("/api/articles/:article_id", getApiArticles);
app.get("/api/articles", getAllApiArticles);
app.get("/api/articles/:article_id/comments", getApiCommentsByArticleId);
app.post("/api/articles/:article_id/comments", insertApiComment);
app.patch("/api/articles/:article_id", updateApiArticle);

// /api/users
app.get("/api/users", getAllApiUsers);
app.get("/api/users/:username", getAllApiUsers);

// /api/comments
app.patch("/api/comments/:comment_id", updateApiComment);
app.delete("/api/comments/:comment_id", deleteApiComment);

app.all("*", pathNotFound);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
