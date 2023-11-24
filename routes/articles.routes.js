const {
  getApiArticles,
  getAllApiArticles,
  updateApiArticle,
  deleteApiArticle,
  insertApiArticle,
} = require("../controllers/articles.controllers");
const {
  getApiCommentsByArticleId,
  insertApiComment,
} = require("../controllers/comments.controllers");

const express = require("express");

const router = express.Router();

router
.route("/")
.get(getAllApiArticles)
.post(insertApiArticle);

router
.route("/:article_id")
.get(getApiArticles)
.patch(updateApiArticle)
.delete(deleteApiArticle);

router
.route("/:article_id/comments")
.get(getApiCommentsByArticleId)
.post(insertApiComment);

module.exports = router;
