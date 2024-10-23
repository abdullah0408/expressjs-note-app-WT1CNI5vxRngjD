import express from 'express'; // Import Express for routing
import { 
    dashboardPage, 
    dashboardPageViewNote, 
    dashboardPageUpdateNote, 
    dashboardPageDeleteNote, 
    dashboardAddNote, 
    dashboardPageSubmit, 
    dashboardSearch, 
    dashboardSearchSumbit 
} from '../controllers/dashboardController.js'; // Import the controller functions
import isLoggedIN from '../middleware/checkAuth.js'; // Import authentication middleware
import logger from '../../logger.js'; // Import your logger

const dashboard = express.Router(); // Create a new Router for dashboard routes

// Dashboard Home
dashboard.get('/', isLoggedIN, (req, res, next) => {
    logger.info(`User accessed dashboard: ${req.user.displayName}`); // Log access to dashboard
    dashboardPage(req, res, next); // Render the dashboard page
});

// View Note
dashboard.get('/item/:id', isLoggedIN, (req, res, next) => {
    logger.info(`User viewed note: ${req.params.id}`); // Log the viewed note ID
    dashboardPageViewNote(req, res, next); // Render the specific note page
});

// Update Note
dashboard.put('/item/:id', isLoggedIN, (req, res, next) => {
    logger.info(`User updated note: ${req.params.id}`); // Log the updated note ID
    dashboardPageUpdateNote(req, res, next); // Update the specific note
});

// Delete Note
dashboard.delete('/item-delete/:id', isLoggedIN, (req, res, next) => {
    logger.info(`User deleted note: ${req.params.id}`); // Log the deleted note ID
    dashboardPageDeleteNote(req, res, next); // Delete the specific note
});

// Add Note
dashboard.get('/add', isLoggedIN, (req, res) => {
    logger.info(`User accessed add note page`); // Log access to the add note page
    dashboardAddNote(req, res); // Render the add note page
});

// Submit New Note
dashboard.post('/add', isLoggedIN, (req, res, next) => {
    logger.info(`User submitted a new note`); // Log submission of a new note
    dashboardPageSubmit(req, res, next); // Handle the submission of the new note
});

// Search Notes
dashboard.get('/search', isLoggedIN, (req, res) => {
    logger.info(`User accessed search page`); // Log access to the search page
    dashboardSearch(req, res); // Render the search page
});

// Submit Search
dashboard.post('/search', isLoggedIN, (req, res, next) => {
    logger.info(`User submitted search: ${req.body.searchTerm}`); // Log the submitted search term
    dashboardSearchSumbit(req, res, next); // Handle the search submission
});

export default dashboard; // Export the dashboard router
