const router = require("express").Router();

const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  likeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId", likeItem);

module.exports = router;
