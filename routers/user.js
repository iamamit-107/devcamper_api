const router = require("express").Router({ mergeParams: true });
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const User = require("../models/User");

// protect routes middleware
const { protect, authorize } = require("../middlewares/auth");
const advancedResults = require("../middlewares/advancedResults");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
