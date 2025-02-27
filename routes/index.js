const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const authMiddleware = require("../middlewares/auth");
const express = require("express");
const { getItems } = require("../controllers/clothingItems");
const app = express();
const {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
} = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.get("/users/me", authMiddleware, getCurrentUser);
router.patch("/users/me", authMiddleware, updateCurrentUser);

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);
app.use(authMiddleware);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Page is not found" });
});

module.exports = router;
