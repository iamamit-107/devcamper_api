const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  //   Make Sure token exist
  if (!token) {
    return next(new errorResponse("Not authorzied to access this route", 401));
  }

  try {
    //   Verify token
    const decode = jwt.verify(token, process.env.JWT_TOKEN);
    console.log(decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (error) {
    return next(new errorResponse("Not authorzied to access this route", 401));
  }
});

// Grant Access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(
          `User role ${req.user.role} not authorzied to access this route`,
          401
        )
      );
    }

    next();
  };
};
