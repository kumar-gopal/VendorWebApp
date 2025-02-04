import { logger } from "../utils/logger.js";

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            logger.error(`Authorization failed: No user information in request.`);
            return res.status(401).json({
                message: "Authorization required.",
                success: false,
            });
        }

        const { role } = req.user;

        if (role !== "admin") {
            logger.warn(`Unauthorized access attempt by user: ${email || id || "unknown"}`);
            return res.status(403).json({
                message: "Access denied. Admin privileges are required.",
                success: false,
            });
        }

        next();
    } catch (error) {
        logger.error(`Error in isAdmin middleware: ${error.message}`);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false,
        });
    }
};
