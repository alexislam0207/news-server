const {
  deleteApiComment,
  updateApiComment,
} = require("../controllers/comments.controllers");
const express = require("express");

const router = express.Router();

router
.route("/:comment_id")
.patch(updateApiComment)
.delete(deleteApiComment);

module.exports = router;
