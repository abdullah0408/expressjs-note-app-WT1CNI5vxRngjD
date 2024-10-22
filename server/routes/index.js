import express from 'express';
import { homepage, about } from '../controllers/indexController.js';
import logger from '../../logger.js'; // Import your logger

const index = express.Router(); // Correct usage of express.Router()

// Homepage Route
index.get('/', (req, res, next) => {
    logger.info('User accessed homepage');
    homepage(req, res, next); // Call the homepage controller
});

// About Page Route
index.get('/about', (req, res, next) => {
    logger.info('User accessed about page');
    about(req, res, next); // Call the about controller
});

export default index; // Export the router, not the route
