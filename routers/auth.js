const router = require("express").Router();
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.get("/login", login);
router.get("/me", protect, getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
