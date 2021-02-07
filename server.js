const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");
// importing Routes
const bootcamp = require("./routers/bootcamps");
const courses = require("./routers/courses");
const auth = require("./routers/auth");
const user = require("./routers/user");

const app = express();

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parse middleware
app.use(express.json());
// Cookie Parser
app.use(cookieParser());
// File upload
app.use(fileupload());
// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Mounitng Routes
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use(errorHandler);

const PORT = process.env.PORT || 6000;
const server = app.listen(PORT, () => {
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  connectDB();
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server and exit
  server.close(() => process.exit(1));
});
