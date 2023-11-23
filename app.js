const express = require("express");
const { getAllApiUsers } = require("./controllers/users.controllers");
const { getAllApiTopics, insertApiTopic } = require("./controllers/topics.controllers");
const { getAllApiEndpoints } = require("./controllers/endpoints.controllers");
const {
  getApiArticles,
  getAllApiArticles,
  updateApiArticle,
  deleteApiArticle,
} = require("./controllers/articles.controllers");
const {
  getApiCommentsByArticleId,
  insertApiComment,
  deleteApiComment,
  updateApiComment,
} = require("./controllers/comments.controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
  pathNotFound
} = require("./controllers/error");

const app = express();
app.use(express.json());

// /api
app.get("/api", getAllApiEndpoints);

// /api/topics
app.route("/api/topics")
.get(getAllApiTopics)
.post(insertApiTopic);

// /api/articles
app.get("/api/articles", getAllApiArticles);
app
  .route("/api/articles/:article_id")
  .get(getApiArticles)
  .patch(updateApiArticle)
  .delete(deleteApiArticle);
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
