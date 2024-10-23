import logger from "../../logger.js"; // Import logger for logging activities

// Middleware function to check if the user is logged in
const isLoggedIN = (req, res, next) => {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        logger.info(`User authenticated: ${req.user._id}`); // Log successful authentication
        next(); // Proceed to the next middleware or route handler
    } else {
        logger.warn(`Unauthorized access attempt by IP: ${req.ip}`); // Log unauthorized access attempts
        res.redirect('/auth/google'); // Redirect to Google authentication page if not authenticated
    }
};

export default isLoggedIN; // Export the middleware for use in routes
