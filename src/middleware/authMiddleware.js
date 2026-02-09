const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    //get authorization header
    const authHeader = req.headers.authorization;

    //check if token exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    //extract token
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //attach user info to request 
    req.user = decoded;

    //move to next middleware/route
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid"
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access forbidden: insufficient permissions"
      });
    }
    next();
  };
};
