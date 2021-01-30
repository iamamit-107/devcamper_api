const asyncHandler = require("../middlewares/async");
const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");

/**
 *
 * @desc  Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const allBootcamp = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: allBootcamp.length,
    data: allBootcamp,
  });
});

/**
 *
 * @desc  Get Single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access PUBLIC
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const singleBootcamp = await Bootcamp.findById(id);

  if (!singleBootcamp) {
    return next(new errorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: singleBootcamp,
  });
});

/**
 *
 * @desc  Create new bootcamp
 * @route POST /api/v1/bootcamps
 * @access PRIVATE
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 *
 * @desc  update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access PRIVATE
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(new errorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 *
 * @desc  delete bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access PRIVATE
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);

  if (!bootcamp) {
    return next(new errorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  res.status(201).json({
    success: true,
    data: {},
  });
});
