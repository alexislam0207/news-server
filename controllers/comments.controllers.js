const {
  getCommentsByArticeId,
  insertComment,
  updateComment,
  deleteComment,
} = require("../models/comments.models");
const { checkIfArticleIdExist } = require("../models/articles.models");

exports.getApiCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  const promises = [getCommentsByArticeId(article_id, limit, p)];

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
