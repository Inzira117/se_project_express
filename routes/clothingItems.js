const router = require("express").Router();

const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId", likeItem);
router.delete("/:itemId", dislikeItem);

module.exports = router;
