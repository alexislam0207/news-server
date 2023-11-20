const {
  getAllTopics,
  getAllEndpoints,
  getCommentsByArticeId,
} = require("../models/models");

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

exports.getApiCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  getCommentsByArticeId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
