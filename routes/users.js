const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");

// starts with /users

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateCurrentUser);

module.exports = router;
