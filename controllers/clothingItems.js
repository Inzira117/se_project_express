const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
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
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params.itemId;

  clothingItem
    .findById(itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_ERROR_CODE; // Use 404 for missing items
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res.status(FORBIDDEN_STATUS_CODE).json({
          message: "Forbidden: You are not the owner of this item.",
        });
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() =>
          res.status(200).json({ message: "Item successfully deleted" })
        );
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ message: "Invalid item ID" }); // 400 for invalid format
      }
      if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "Item not found" }); // 404 for missing items
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .json({ message: "Internal server error" });
    });
};

const likeItem = (req, res) => {
  return clothingItem
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
    .then((item) => res.status(200).json({ data: item }))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ message: "Invalid Item Id" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .json({ message: "likeItem Error" });
    });
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid Item Id" });
      } else {
        res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "likeItem Error" });
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
