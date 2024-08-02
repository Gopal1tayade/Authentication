const express  = require('express');
const Student = require('../Models/Student');
const studentLogin = require('../Models/studentLogin');
const studentSignUp = require('../Models/studentSignup');
const {auth} = require("../midleware/sessionAuthentication");
require("../service/authenticate");

const {handleGetAllusers,handleRegisterStudent ,verifyOtp ,handleStudentLogin,handleStudneAccount ,handleStudentUpdate}   = require('../Controller/Student');

const routes = express.Router();






routes.route("/").get( handleGetAllusers).post(handleRegisterStudent);
routes.route("/verifyStudent").post(verifyOtp);
routes.route("/login").post(handleStudentLogin);

routes.route("/login/provideinfo").post(auth ,handleStudneAccount);
routes.route("/login/updateinfo").patch(auth , handleStudentUpdate);



module.exports = routes;










