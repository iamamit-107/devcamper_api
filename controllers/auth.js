const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");

/**
 *
 * @desc  Register a user
 * @route POST /api/v1/auth/register
 * @access Public
 */

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //   Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

/**
 *
 * @desc  Login user
 * @route GET /api/v1/auth/login
 * @access Public
 */

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(
      new errorResponse("Please provide valid email and password", 400)
    );
  }

  //   Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  //   Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// GET Token from model, create COOKIE and send response
const sendTokenResponse = (model, statusCode, res) => {
  //   Create Token
  const token = model.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

/**
 *
 * @desc  Get Logged in user
 * @route GET /api/v1/auth/me
 * @access Public
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
