const { User } = require("../models");

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, msg: "user not found" });
      else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

module.exports = getUserByUsername;
