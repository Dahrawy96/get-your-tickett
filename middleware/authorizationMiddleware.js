module.exports = function authorizationMiddleware(roles) {
<<<<<<< HEAD
    return (req, res, next) => {
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
      next();
    };
  };
  
=======
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};
>>>>>>> dahrawy
