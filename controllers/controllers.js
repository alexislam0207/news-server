const {
  getAllTopics,
  getAllEndpoints,
  getArticles,
  getCommentsByArticeId,
  checkIfArticleIdExist,
} = require("../models/models");

exports.pathNotFound = (req, res) => {
  res.status(404).send({ msg: "path not found" });
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

exports.getApiArticles = (req, res, next) => {
  const { article_id } = req.params;
  getArticles(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getApiCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [getCommentsByArticeId(article_id)];

  if (article_id) {
    promises.push(checkIfArticleIdExist(article_id));
  }

  Promise.all(promises)
    .then((reslovedPromises) => {
      res.status(200).send({ comments: reslovedPromises[0] });
    })
    .catch(next);
};
