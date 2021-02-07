const asyncHandler = require("../middlewares/async");
const crypto = require("crypto");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

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

/**
 *
 * @desc  Get Logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 *
 * @desc  Update user details
 * @route PUT /api/v1/auth/updatedetails
 * @access Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const update = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 *
 * @desc  Update user Password
 * @route PUT /api/v1/auth/updatepassword
 * @access Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new errorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 *
 * @desc  Forget password
 * @route GET /api/v1/auth/forgetpassword
 * @access Public
 */
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorResponse(`No user with this email`, 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  console.log(
    "from controller: ",
    crypto.createHash("sha256").update(resetToken).digest("hex")
  );

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request on: \n\n ${resetUrl} `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new errorResponse("Email could not be sent", 500));
  }
});

/**
 *
 * @desc  Reset password
 * @route GET /api/v1/auth/resetpassword/:resettoken
 * @access Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken.toString())
    .digest("hex");

  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
  });

  if (!user) {
    return next(new errorResponse("Invalid token", 400));
  }

  // set password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

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
