const mongoose = require("mongoose");

const studentSignUp = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
 
});

module.exports = mongoose.model("studentSignUp", studentSignUp);
