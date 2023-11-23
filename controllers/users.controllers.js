const { getAllUsers } = require("../models/users.models");

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
