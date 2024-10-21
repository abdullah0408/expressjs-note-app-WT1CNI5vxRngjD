import express from 'express';
import { dashboardPage } from '../controllers/dashboardController.js';

const dashboard = express.Router(); // Correct usage of express.Router()

dashboard.get('/', dashboardPage) // Define the route properly

export default dashboard;