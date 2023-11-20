const { getAllTopics, getAllEndpoints } = require("../models/models");

exports.pathNotFound = (req, res) => {
  res.status(400).send({ msg: "path not found" });
};

exports.getAllApiTopics = (req, res, next) => {
  getAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getAllApiEndpoints = (req, res, next) => {
  getAllEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
