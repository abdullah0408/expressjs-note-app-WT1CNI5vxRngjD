import logger from "../../logger.js";

const homepage = (req, res) => {
    const locals = {
        title: "Home"
    };
    res.render("index", {
        locals,
        layout: '../views/layouts/front-page.ejs',
    }); // Renders the "index" template with locals

    logger.info(`Homepage accessed by user: ${req.user ? req.user._id : 'Guest'}`); // Log access to the homepage
};

const about = (req, res) => {
    const locals = {
        title: "About Us" // Changed the title to reflect the About page
    };
    res.render("about", locals); // Assuming you have an "about.ejs" or similar template

    logger.info(`About page accessed by user: ${req.user ? req.user._id : 'Guest'}`); // Log access to the about page
};

export { homepage, about };

