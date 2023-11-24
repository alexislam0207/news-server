const {
    getAllApiTopics,
    insertApiTopic,
  } = require("../controllers/topics.controllers");
const express = require("express");

const router = express.Router();

router
.route("/")
.get(getAllApiTopics)
.post(insertApiTopic);

module.exports = router;