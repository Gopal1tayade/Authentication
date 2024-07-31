const JWT = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET ;

function setStudent(student){
    return JWT.sign({
        id:student._id,
        email: student.email,
    } , secret,{ expiresIn: '1h' });

}


function getStudent(token){
    if(!token) return null ;
    return JWT.verify(token, secret);

}

module.exports ={
    setStudent,
    getStudent
}