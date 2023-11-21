const express = require("express");
const {
  pathNotFound,
  getAllApiTopics,
  getAllApiEndpoints,
  getApiArticles,
  getAllApiArticles,
  insertApiComment,
} = require("./controllers/controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./error");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllApiTopics);
app.get("/api", getAllApiEndpoints);
app.get("/api/articles/:article_id", getApiArticles);
app.get("/api/articles", getAllApiArticles);

app.post("/api/articles/:article_id/comments", insertApiComment);

app.all("*", pathNotFound);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
