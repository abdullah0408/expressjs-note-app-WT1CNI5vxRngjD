import logger from "../../logger.js";

const isLoggedIN = (req, res, next) => {
    if (req.isAuthenticated()) {
        logger.info(`User authenticated: ${req.user._id}`); // Log successful authentication
        next();
    } else {
        logger.warn(`Unauthorized access attempt by IP: ${req.ip}`); // Log unauthorized access attempts
        res.redirect('/auth/google');
    }
};

export default isLoggedIN;
