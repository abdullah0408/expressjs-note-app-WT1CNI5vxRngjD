import express from 'express';
import { 
    dashboardPage, 
    dashboardPageViewNote, 
    dashboardPageUpdateNote, 
    dashboardPageDeleteNote, 
    dashboardAddNote, 
    dashboardPageSubmit, 
    dashboardSearch, 
    dashboardSearchSumbit 
} from '../controllers/dashboardController.js';
import isLoggedIN from '../middleware/checkAuth.js';
import logger from '../../logger.js'; // Import your logger

const dashboard = express.Router();

// Dashboard Home
dashboard.get('/', isLoggedIN, (req, res, next) => {
    logger.info(`User accessed dashboard: ${req.user.displayName}`);
    dashboardPage(req, res, next);
});

// View Note
dashboard.get('/item/:id', isLoggedIN, (req, res, next) => {
    logger.info(`User viewed note: ${req.params.id}`);
    dashboardPageViewNote(req, res, next);
});

// Update Note
dashboard.put('/item/:id', isLoggedIN, (req, res, next) => {
    logger.info(`User updated note: ${req.params.id}`);
    dashboardPageUpdateNote(req, res, next);
});

// Delete Note
dashboard.delete('/item-delete/:id', isLoggedIN, (req, res, next) => {
    logger.info(`User deleted note: ${req.params.id}`);
    dashboardPageDeleteNote(req, res, next);
});

// Add Note
dashboard.get('/add', isLoggedIN, (req, res) => {
    logger.info(`User accessed add note page`);
    dashboardAddNote(req, res);
});

// Submit New Note
dashboard.post('/add', isLoggedIN, (req, res, next) => {
    logger.info(`User submitted a new note`);
    dashboardPageSubmit(req, res, next);
});

// Search Notes
dashboard.get('/search', isLoggedIN, (req, res) => {
    logger.info(`User accessed search page`);
    dashboardSearch(req, res);
});

// Submit Search
dashboard.post('/search', isLoggedIN, (req, res, next) => {
    logger.info(`User submitted search: ${req.body.searchTerm}`);
    dashboardSearchSumbit(req, res, next);
});

export default dashboard;
