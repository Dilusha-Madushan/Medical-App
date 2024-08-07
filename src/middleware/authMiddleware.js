const { admin } = require('../config/firebaseConfig');

// Middleware to verify Firebase token (authentication)
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log(token)
  if (token === '') {
    return res.status(403).send({ error: true, message: "No token provided." });
  }
  try {
    req.user = token;
    next();
  } catch (error) {
    res.status(403).send({ message: "Invalid token.", error: true });
  }
};
