const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// 🍪 Middleware to verify token from cookies
module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;

  if (!cookie || !cookie.token) {
    return res.status(401).json({ message: "No token provided in cookies" });
  }

  const token = cookie.token;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded.user; // same structure: { id, role }
    next();
  });
};
