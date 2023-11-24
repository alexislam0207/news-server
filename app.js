const express = require("express");
const { getAllApiEndpoints } = require("./controllers/endpoints.controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
  pathNotFound,
} = require("./controllers/error");
const topicsRoute = require("./routes/topics.routes");
const usersRoute = require("./routes/users.routes");
const articlesRoute = require("./routes/articles.routes");
const commentsRoute = require("./routes/comments.routes");

const app = express();
app.use(express.json());

app.use("/api/topics", topicsRoute);
app.use("/api/users", usersRoute);
app.use("/api/articles", articlesRoute);
app.use("/api/comments", commentsRoute);

app.get("/api", getAllApiEndpoints);

app.all("*", pathNotFound);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
