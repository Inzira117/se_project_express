const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");
const {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
} = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.get("/users/me", authMiddleware, getCurrentUser);
router.patch("/users/me", authMiddleware, updateCurrentUser);

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(authMiddleware);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Page is not found" });
});

module.exports = router;
