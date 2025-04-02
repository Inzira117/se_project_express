const clothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid item ID" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
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
        return res.status(BadRequestError).json({ message: "Invalid item ID" }); // 400 for invalid format
      }
      if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).json({ message: "Item not found" }); // 404 for missing items
      }
      return res.status(ServerError).json({ message: "Internal server error" });
    });
};

const likeItem = (req, res) =>
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
        return res.status(NotFoundError).json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).json({ message: "Invalid Item Id" });
      }
      return res.status(ServerError).json({ message: "likeItem Error" });
    });

const dislikeItem = (req, res) => {
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
        res.status(NotFoundError).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BadRequestError).send({ message: "Invalid Item Id" });
      } else {
        res.status(ServerError).send({ message: "likeItem Error" });
      }
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
