import express from 'express'; // Import Express for routing
import { homepage } from '../controllers/indexController.js'; // Import the homepage controller
import logger from '../../logger.js'; // Import your logger

const index = express.Router(); // Create a new Router for index routes

// Homepage Route
index.get('/', (req, res, next) => {
    logger.info('User accessed homepage'); // Log access to the homepage
    homepage(req, res, next); // Call the homepage controller
});

export default index; // Export the router
