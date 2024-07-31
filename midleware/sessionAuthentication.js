const { getStudent } = require("../service/authenticate");
const JWT = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    
    const decoded = getStudent(token);
    

    if (!decoded) {
      throw new Error('Token is not valid');
    }

    req.user = decoded;
    
    next();
  } catch (err) {
    console.error('Token validation error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = {
  auth,
};
