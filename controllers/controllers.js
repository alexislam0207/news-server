const { getAllUsers } = require("../models/users.models");
const { getAllTopics } = require("../models/topics.models");
const { getAllEndpoints } = require("../models/endpoints.models");
const {
  getArticles,
  getAllArticles,
  checkIfArticleIdExist,
  updateArticle,
} = require("../models/articles.models");
const {
  getCommentsByArticeId,
  insertComment,
  updateComment,
  deleteComment,
} = require("../models/comments.models");

exports.pathNotFound = (req, res) => {
  res.status(404).send({ msg: "path not found" });
};

// /api
exports.getAllApiEndpoints = (req, res, next) => {
  getAllEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};

// /api/topics
exports.getAllApiTopics = (req, res, next) => {
  getAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

// /api/articles
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

exports.insertApiComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  insertComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
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

// users
exports.getAllApiUsers = (req, res, next) => {
  const { username } = req.params;
  getAllUsers(username)
    .then((users) => {
      if (username) {
        res.status(200).send({ user: users });
      } else {
        res.status(200).send({ users });
      }
    })
    .catch(next);
};

// /api/comments
exports.updateApiComment = (req, res, next) => {
  const { comment_id } = req.params;
  const updateVote = req.body;
  updateComment(comment_id, updateVote)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteApiComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
