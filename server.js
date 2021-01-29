const express = require("express");
const dotenv = require("dotenv");

//Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 6000;

app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);