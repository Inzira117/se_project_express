const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      } else
        res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      } else
        res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
