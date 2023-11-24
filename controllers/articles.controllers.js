const {
  getArticles,
  getAllArticles,
  checkIfArticleIdExist,
  updateArticle,
  deleteArticle,
  insertArticle,
} = require("../models/articles.models");

exports.getApiArticles = (req, res, next) => {
  const { article_id } = req.params;
  getArticles(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllApiArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  getAllArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.insertApiArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.updateApiArticle = (req, res, next) => {
  const { article_id } = req.params;
  const updateVote = req.body;
  const promises = [
    updateArticle(article_id, updateVote),
    checkIfArticleIdExist(article_id),
  ];

  Promise.all(promises)
    .then((reslovedPromises) => {
      res.status(201).send({ article: reslovedPromises[0] });
    })
    .catch(next);
};

exports.deleteApiArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
