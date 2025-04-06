const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { UnauthorizedError } = require("../utils/UnauthorisedError");
const { ConflictError } = require("../utils/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  console.log({ name, avatar, email, password });

  if (!email) {
    return next(new BadRequestError("Email is required"));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        console.log("existingUser", existingUser);
        throw new ConflictError("Failed Request: Email already exists.");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const createdUser = user.toObject();
      delete createdUser.password;
      return res.send(createdUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({ jwt: token });
    })
    .catch(() => next(new UnauthorizedError("Incorrect email or password")));
};

const updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .select("+password")
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found."));
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
