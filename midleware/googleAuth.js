 const passport = require('passport');


const googleAuth = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Authentication Failed' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login Failed' });
        }
       next();
        
      });
    })(req, res, next);
}

module.exports ={
    googleAuth,
}