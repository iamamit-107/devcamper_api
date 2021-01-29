/**
 *
 * @desc  Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps",
  });
};

/**
 *
 * @desc  Get Single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access PUBLIC
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show single bootcamps ${req.params.id}`,
  });
};

/**
 *
 * @desc  Create new bootcamp
 * @route POST /api/v1/bootcamps
 * @access PRIVATE
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "create new bootcamp",
  });
};

/**
 *
 * @desc  update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access PRIVATE
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `update bootcamp ${req.params.id}`,
  });
};

/**
 *
 * @desc  delete bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access PRIVATE
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `delete bootcamp ${req.params.id}`,
  });
};
