const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified.user;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Middleware to check user role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient role" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
