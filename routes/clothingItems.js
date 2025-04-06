const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", authMiddleware, validateClothingItem, createItem);
router.delete("/:itemId", authMiddleware, validateId, deleteItem);
router.put("/:itemId/likes", authMiddleware, validateId, likeItem);
router.delete("/:itemId/likes", authMiddleware, validateId, dislikeItem);

module.exports = router;
