const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { ConnectMongodb } = require("./connection");
const app = express();

const studentRouter = require("./Routes/routes");

const dotenv = require("dotenv");
dotenv.config();

ConnectMongodb(process.env.DB);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/student", studentRouter);

app.listen(8000, () => {
  console.log("Hi this is the task second to authenticat and create a user");
});
