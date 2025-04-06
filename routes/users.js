const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

// starts with /users

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, validateUserUpdate, updateCurrentUser);

module.exports = router;
