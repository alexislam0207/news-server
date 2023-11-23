const { getAllTopics, insertTopic } = require("../models/topics.models");

exports.getAllApiTopics = (req, res, next) => {
  getAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.insertApiTopic = (req, res, next) => {
  const newTopic = req.body;

  insertTopic(newTopic)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
