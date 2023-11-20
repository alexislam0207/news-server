const express = require("express");
const { pathNotFound, getAllApiTopics } = require("./controllers/controllers");
const { handleServerErrors } = require("./error");

const app = express();

app.get("/api/topics", getAllApiTopics);

app.all("*", pathNotFound);

app.use(handleServerErrors);

module.exports = app;
