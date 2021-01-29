const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// importing Routes
const bootcamp = require("./routers/bootcamps");

//Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Dev logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mounitng Routes
app.use("/api/v1/bootcapms", bootcamp);

const PORT = process.env.PORT || 6000;

app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
