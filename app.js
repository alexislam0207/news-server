const express = require("express");
const {
  pathNotFound,
  getAllApiTopics,
  getAllApiEndpoints,
  getApiCommentsByArticleId,
} = require("./controllers/controllers");
const { handleServerErrors } = require("./error");

const app = express();

app.get("/api/topics", getAllApiTopics);
app.get("/api", getAllApiEndpoints);
app.get("/api/articles/:article_id/comments",getApiCommentsByArticleId)

app.all("*", pathNotFound);

app.use(handleServerErrors);

module.exports = app;
