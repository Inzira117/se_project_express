const router = require("express").Router();
const { createUser, login } = require("../controllers/users");

router.post("/signup/me", createUser);
router.post("/signin/me", login);

module.exports = router;
