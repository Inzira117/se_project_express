const clothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next({
        status: ServerError,
        message: "An error has occurred on the server",
      });
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next({ status: BadRequestError, message: "Invalid item ID" });
      }
      next({
        status: ServerError,
        message: "An error has occurred on the server",
      });
    });
};

const deleteItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  clothingItem
    .findById(itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res.status(ForbiddenError).json({
          message: "Forbidden: You are not the owner of this item.",
        });
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() => res.json({ message: "Item successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next({ status: BadRequestError, message: "Invalid item ID" });
      }
      if (err.statusCode === NotFoundError) {
        return next({ status: NotFoundError, message: "Item not found" });
      }
      next({ status: ServerError, message: "Internal server error" });
    });
};

const likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.name = "NotFoundError";
      throw error;
    })
    .then((item) => res.json({ data: item }))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        return next({ status: NotFoundError, message: "Item not found" });
      }
      if (err.name === "CastError") {
        return next({ status: BadRequestError, message: "Invalid Item ID" });
      }
      next({ status: ServerError, message: "likeItem Error" });
    });
};

const dislikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NotFoundError;
      throw error;
    })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.statusCode === NotFoundError) {
        return next({ status: NotFoundError, message: err.message });
      }
      if (err.name === "CastError") {
        return next({ status: BadRequestError, message: "Invalid Item ID" });
      }
      next({ status: ServerError, message: "dislikeItem Error" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
