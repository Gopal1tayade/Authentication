const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNumber:{type : String , required :true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  userName: { type: String },
  mobileNumber: { type: String },
  address: { type: String },
  majorSubject: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String },
  language: { type: String },
  profileVisibility: { type: String, default: "private" },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("studentAccount", studentSchema);
