const mongoose = require("mongoose");

const studentLogin = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  
});

module.exports = mongoose.model("studentLogin", studentLogin);
