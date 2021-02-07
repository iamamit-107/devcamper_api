const router = require("express").Router();
const {
  register,
  login,
  getMe,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
