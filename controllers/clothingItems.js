const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
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
  console.log(req.user._id);

  clothingItem
    .create({ name, weather, imageUrl })
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

const updateItem = (req, res) => {
  const { itemId, imageUrl } = req.params;
  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail(new Error("Item ID not found"))
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "Internal server error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail(new Error("Item ID not found"))
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "Internal server error" });
    });
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(new Error("Item ID not found"))
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR_STATUS_CODE).send({ message: "likeItem Error" });
    });
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(new Error("Item ID not found"))
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "dislikeItem Error" });
    });
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
