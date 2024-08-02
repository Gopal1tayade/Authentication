const Student = require("../Models/Student");
const studentLogin = require("../Models/studentLogin");
const studentSignUp = require("../Models/studentSignup");
const user = require("../Models/user");
const sendOtpEmail = require("./mailer");
const { setStudent,setgoogleStudent ,tokenBlacklist} = require("../service/authenticate");

async function handleGetAllusers(req, res) {
  const students = await Student.find({});
  return res.json(students);
}

const handleRegisterStudent = async (req, res) => {      // sginup the student and verify its email
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

const handleStudentLogin = async (req, res) => { // for student login
  try {
    if (req.user) {
      const googleUser = req.user;
      const googleId = googleUser.googleId;
      const student = await user.findOne({ googleId });
      const token = setgoogleStudent(student);

      return res.status(200).json({ token, student });

    } else {
      const { email, password } = req.body;
      console.log(email, password);
      const student = await studentLogin.findOne({ email });

      if (!student)
        return res
          .status(400)
          .json({ message: "Student not found.....! Please Register first" });
      const isMatch = password === student.password;

      if (!isMatch)
        return res.status(400).json({ message: "Invalid Credential" });
      const token = setStudent(student);

      return res.status(200).json({ token, student });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleStudneAccount = async (req, res) => {
  try {
    if (req.user.googleId) {
      googleId = req.user.googleId;
      const useNew = await user.findOne({googleId});
      const fullName = useNew.displayName.split(' ');
      firstName = fullName[0];
      lastName = fullName[1];
      email = useNew.email;
      let {
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
      profilePicture = useNew.profilePhoto;
      isVerified = true;
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
    }
     else {
      const email = req.user.email;
      const signupStudent = await studentSignUp.findOne({ email });
      firstName = signupStudent.firstName;
      lastName = signupStudent.lastName;
      isVerified = true;
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
    }
  } catch (error) {
    return res.status(500).json({ error: error.message  });
  }
};

const handleLogOut = (req , res) =>{   // for student logout

  try {
    const token = req.header('x-auth-token');
    if (token) {
        tokenBlacklist.add(token);
    }
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed', error: err });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to destroy session', error: err });
        }
        res.clearCookie('connect.sid', { path: '/' });
        return res.status(200).json({ message: 'Logout successful' });
      });
    });
  } catch (error) {
    return res.status(500).json({error:error.message});
  }

}

const handleStudentUpdate = async(req ,res) =>{
  try {
        if(req.user.googleId){
          const email = req.user.email;
          const body = req.body;
     
          await Student.updateOne({email},{$set:body});
    
         return res.status(200).json({message:"Student details are updated sucessfully"});
            
        }
        else{
          const email = req.user.email;
          const body = req.body;
     
          await Student.updateOne({email},{$set:body});
         return res.status(200).json({message:"Student details are updated sucessfully"});
        }
    

  } catch (error) {
    return res.status(500).json({error: message.error});
  }
     
};



module.exports = {
  handleGetAllusers,
  handleRegisterStudent,
  verifyOtp,
  handleStudentLogin,
  handleStudneAccount,
  handleLogOut,
  handleStudentUpdate,
};

