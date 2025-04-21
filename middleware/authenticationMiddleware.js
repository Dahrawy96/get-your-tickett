const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

<<<<<<< HEAD
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
=======
module.exports = function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided in Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
>>>>>>> dahrawy
