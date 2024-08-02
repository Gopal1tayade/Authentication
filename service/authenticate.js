const JWT = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET ;

const tokenBlacklist = new Set();

function setStudent(student){
    return JWT.sign({
        id:student._id,
        email: student.email,
    } , secret,{ expiresIn: '1h' });

}

function setgoogleStudent(student){
    return JWT.sign({
        id:student._id,
        googleId:student.googleId,
        email: student.email,
    } , secret,{ expiresIn: '1h' });

}

function getStudent(token){
    if(!token) return null ;
    if (tokenBlacklist.has(token)) {
        throw new Error('Token is blacklisted');
    }
    return JWT.verify(token, secret);

}

module.exports ={
    setStudent,
    getStudent,
    setgoogleStudent,
    tokenBlacklist,
}