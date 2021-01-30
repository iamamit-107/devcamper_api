const Bootcamp = require("../models/Bootcamp");

/**
 *
 * @desc  Get All bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = async (req, res, next) => {
  try {
    const allBootcamp = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: allBootcamp.length,
      data: allBootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 *
 * @desc  Get Single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access PUBLIC
 */
exports.getBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const singleBootcamp = await Bootcamp.findById(id);
    res.status(200).json({
      success: true,
      data: singleBootcamp,
    });

    if (!singleBootcamp) {
      return res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 *
 * @desc  Create new bootcamp
 * @route POST /api/v1/bootcamps
 * @access PRIVATE
 */
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 *
 * @desc  update bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access PRIVATE
 */
exports.updateBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
      });
    }

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

/**
 *
 * @desc  delete bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access PRIVATE
 */
exports.deleteBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
      });
    }

    res.status(201).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};
