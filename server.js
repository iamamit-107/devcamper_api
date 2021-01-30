const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
// importing Routes
const bootcamp = require("./routers/bootcamps");

//Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parse middleware
app.use(express.json());
// Mounitng Routes
app.use("/api/v1/bootcapms", bootcamp);

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
