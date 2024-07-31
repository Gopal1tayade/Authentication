const Student = require("../Models/Student");
const studentLogin = require("../Models/studentLogin");
const studentSignUp = require("../Models/studentSignup");
const sendOtpEmail = require("./mailer");
const { setStudent } = require("../service/authenticate");

async function handleGetAllusers(req, res) {
  const students = await studentSignUp.find({});
  return res.json(students);
}


const handleRegisterStudent = async (req, res) => {
  // sginup the student and verify its email
  try {
    const { firstName, lastName, email, password, confiremPassword } = req.body;
    if (password !== confiremPassword) {
      return res.status(409).json({ message: "Password is not Same..." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newStudent = new studentSignUp({
      firstName,
      lastName,
      email,
      password,
      otp,
    });
    await newStudent.save();

    await sendOtpEmail(email, otp);

    return res
      .status(201)
      .json({ message: "User registered. OTP sent to email." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




const verifyOtp = async (req, res) => {
  // check the opt for the student mail verification
  try {
    const { email, otp } = req.body;
    const student = await studentSignUp.findOne({ email, otp });

    if (!student) return res.status(400).json({ message: "Invalid OTP" });
    const password = student.password;
    isVerified = true;
    student.otp = null;
    await student.save();

    const studentlogin = new studentLogin({ email, password, isVerified }); // if the email is verifyed then add the user pass and emil in database for next login
    await studentlogin.save();

    res.status(200).json({ message: "student verified" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const handleStudentLogin = async (req, res) => {
  // handler for student login

  try {
    const { email, password } = req.body;
    const student = await studentLogin.findOne({ email });

    if (!student) return res.status(400).json({ message: "Student not found.....! Please Register first" });
    const isMatch = password === student.password;

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credential" });
    const token = setStudent(student);

    return res.status(200).json({token ,student });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const handleStudneAccount = async (req, res) => {
  try {
    
    const email = req.user.email;
    const signupStudent = await studentSignUp.findOne({ email });
    firstName = signupStudent.firstName;
    lastName = signupStudent.lastName;
    isVerified = req.user.isVerified;
    const {
      rollNumber,
      profilePicture,
      userName,
      mobileNumber,
      address,
      majorSubject,
      dateOfBirth,
      gender,
      language,
      profileVisibility,
    } = req.body;
    const fullDetail = new Student({
      rollNumber,
      firstName,
      lastName,
      email,
      profilePicture,
      userName,
      mobileNumber,
      address,
      majorSubject,
      dateOfBirth,
      gender,
      language,
      profileVisibility,
      isVerified,
    });

    await fullDetail.save();

    return res
      .status(201)
      .json({ message: "All the information is submitted sucessfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleGetAllusers,
  handleRegisterStudent,
  verifyOtp,
  handleStudentLogin,
  handleStudneAccount,
};

// rollNumber ,firstName ,lastName ,email ,password , profilePicture,userName,mobileNumber,address ,majorSubject , dateOfBirth ,gender,language,profileVisibility ,otp ,isVerified
