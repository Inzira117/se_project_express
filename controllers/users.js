const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_STATUS_CODE,
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
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        res.status(CONFLICT_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      } else
        res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user.id;
  User.findById(userId)
    .select("+password")
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send(token);
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_STATUS_CODE).send({ message: err.message });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user.id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .select("+password")
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "User not found." });
      }
      delete updatedUser.password;
      res.json(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ message: err.message });
      }
      res
        .status(SERVER_ERROR_STATUS_CODE)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
