import express from 'express';
import { homepage, about } from '../controllers/indexController.js';

const index = express.Router(); // Correct usage of express.Router()

index.get('/', homepage); // Define the route properly
index.get('/about', about);// Define the route properly

export default index; // Export the router, not the route
