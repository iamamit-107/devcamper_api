const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
// importing Routes
const bootcamp = require("./routers/bootcamps");

const app = express();

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parse middleware
app.use(express.json());
// Mounitng Routes
app.use("/api/v1/bootcapms", bootcamp);
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
