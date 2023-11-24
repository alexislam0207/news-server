const { getAllApiUsers } = require("../controllers/users.controllers");
const express = require("express");

const router = express.Router();

router.get("/", getAllApiUsers);
router.get("/:username", getAllApiUsers);

module.exports = router;
