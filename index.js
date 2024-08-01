const express = require("express");
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const { ConnectMongodb } = require("./connection");
const app = express();

const studentRouter = require("./Routes/routes");
const googleAuthentication = require("./service/googleAuthentication");

const dotenv = require("dotenv");
dotenv.config();

ConnectMongodb(process.env.DB);



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Helps to prevent cross-site scripting (XSS) attacks
  }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/student", studentRouter);
app.use("/login",googleAuthentication);

app.listen(8000, () => {
  console.log("Hi this is the task second to authenticat and create a user");
});
