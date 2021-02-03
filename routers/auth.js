const router = require("express").Router();
const { register, login, getMe } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.get("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
