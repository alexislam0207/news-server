const {
  getAllTopics,
  getAllEndpoints,
  getArticles,
  getAllArticles,
  getCommentsByArticeId,
  checkIfArticleIdExist,
  insertComment,
  updateArticle,
  deleteComment,
  getAllUsers,
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
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllApiArticles = (req, res, next) => {
  getAllArticles()
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

exports.deleteApiComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
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

exports.getAllApiUsers = (req, res, next) => {
  getAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
