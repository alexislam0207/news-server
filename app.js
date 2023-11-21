const express = require("express");
const {
  pathNotFound,
  getAllApiTopics,
  getAllApiEndpoints,
  getApiArticles,
  getAllApiArticles,
  getApiCommentsByArticleId,
} = require("./controllers/controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./error");

const app = express();

app.get("/api/topics", getAllApiTopics);
app.get("/api", getAllApiEndpoints);
app.get("/api/articles/:article_id", getApiArticles);
app.get("/api/articles", getAllApiArticles);
app.get("/api/articles/:article_id/comments",getApiCommentsByArticleId)

app.all("*", pathNotFound);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
