const asyncHandler = require("../middlewares/async");
const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geoCoder");

/**
 *
 * @desc  Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new errorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  bootcamp.remove();

  res.status(201).json({
    success: true,
    data: {},
  });
});

/**
 *
 * @desc  get bootcamp within a distance
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Public
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide dist by radius of earth
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/**
 *
 * @desc  upload bootcamp photo
 * @route DELETE /api/v1/bootcamps/:id/photo
 * @access PRIVATE
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new errorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  if (!req.files) {
    return next(new errorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Chech if the file is an img
  if (!file.mimetype.startsWith("image")) {
    return next(new errorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new errorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
        400
      )
    );
  }

  // Custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err.message);
      return next(new errorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
