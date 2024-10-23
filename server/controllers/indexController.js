import logger from "../../logger.js"; // Import logger for logging activities

// Controller function to render the homepage
const homepage = (req, res) => {
    // Set local variables for the view
    const locals = {
        title: "Home | Notes", // Page title
        isLoggedIn: req.isAuthenticated() // Check if the user is authenticated
    };

    // Render the homepage with the specified layout
    res.render("index", {
        locals, // Pass local variables to the view
        layout: '../views/layouts/front-page.ejs', // Use the front-page layout
    });

    // Log homepage access with user details if logged in, else log as "Guest"
    logger.info(`Homepage accessed by user: ${req.user ? req.user._id : 'Guest'}`);
};

// Export the homepage function for use in routes
export { homepage };
