const express = require("express");

const router = express.Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

const { createUser, login } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Page is not found" });
});

module.exports = router;
