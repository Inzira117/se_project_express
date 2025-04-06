const express = require("express");

const router = express.Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const { NotFoundError } = require("../utils/NotFoundError");

const { validateUser, validateLogin } = require("../middlewares/validation");
const { createUser, login } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signin", validateLogin, login);
router.post("/signup", validateUser, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Page is not found"));
});

module.exports = router;
