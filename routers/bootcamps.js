const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middlewares/advancedResults");

// protect routes middleware
const { protect, authorize } = require("../middlewares/auth");

// Include other resource Routers
const coursesRouter = require("./courses");

// Re-Route into other resource Router
router.use("/:bootcampId/courses", coursesRouter);

// Routes
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("admin", "publisher"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("admin", "publisher"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("admin", "publisher"), updateBootcamp)
  .delete(protect, authorize("admin", "publisher"), deleteBootcamp);

module.exports = router;
