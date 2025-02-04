import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        logger.info(`Received Authorization Header: ${authHeader}`);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn("Authorization header missing or invalid");
            return res.status(401).json({ message: 'Unauthorized access', success: false });
        }

        // Extract and sanitize token
        let token = authHeader.split(' ')[1].trim();
        
        // Ensure secret key exists
        if (!process.env.VENDOR_JWT_SECRET) {
            logger.error("JWT Secret is not set in environment variables.");
            return res.status(500).json({ message: "Internal Server Error", success: false });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
        
        // Log decoded token only in development mode
        if (process.env.NODE_ENV === 'DEVELOPMENT') {
            logger.info(`Decoded Token: ${JSON.stringify(decoded)}`);
        }

        req.vendor = decoded;
        logger.info("User authentication successful");
        next();
    } catch (error) {
        logger.error(`Authentication failed: ${error.message}`);

        return res.status(error.name === 'TokenExpiredError' ? 401 : 403).json({
            message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
            success: false,
        });
    }
};

export default verifyToken;
