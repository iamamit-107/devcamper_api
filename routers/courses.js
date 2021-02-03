const router = require("express").Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

// protect routes middleware
const { protect, authorize } = require("../middlewares/auth");

const Course = require("../models/Course");
const advancedResults = require("../middlewares/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("admin", "publisher"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("admin", "publisher"), updateCourse)
  .delete(protect, authorize("admin", "publisher"), deleteCourse);

module.exports = router;
