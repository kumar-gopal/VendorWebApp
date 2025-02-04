import jwt from 'jsonwebtoken';
import { User } from "../model/user.model.js";
import { logger } from '../utils/logger.js';

// Middleware to verify JWT token and validate user
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access', success: false });
  }

  token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and exclude password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found", success: false });
    }

    // Attach user to the request object
    req.user = user;
    logger.info("User decoded and authenticated successfully");

    next();
  } catch (error) {
    logger.error("Token verification failed");
    res.status(401).json({
      message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      success: false,
    });
  }
};

// Middleware to check role-based access
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized", success: false });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions", success: false });
    }

    next();
  };
};


export const adminOnly = (req, res, next) => {
    return authorize('admin')(req, res, next);  // Reusing authorize middleware
};
  


