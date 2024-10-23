import { config } from "dotenv";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import index from "./server/routes/index.js";
import dashboard from "./server/routes/dashboard.js";
import auth from "./server/routes/auth.js";
import connectDB from "./server/config/db.js";
import methodOverride from "method-override";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import path from 'path';
import fs from 'fs/promises'; // Use fs/promises for async/await
import logger from "./logger.js"; // Import your logger

config(); // Load environment variables from .env file

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info(`${req.method} request to ${req.url}`); // Log the method and URL of the request
  next();
});

// Validate environment variables
const requiredEnvVars = ['SESSION_SECRET', 'MONGODB_URI', 'LOGSURL'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    logger.error(`Missing environment variable: ${varName}`);
    process.exit(1); // Exit if any required env variable is missing
  }
}

// Session middleware with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Store sessions in MongoDB
}));

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Use Passport session

connectDB(); // Connect to the MongoDB database

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override for PUT and DELETE requests
app.use(methodOverride("_method"));

// Serve static files from the public directory
app.use(express.static("public"));
app.use(expressLayouts); // Enable EJS layouts
app.set("layout", "./layouts/main"); // Set the default layout
app.set("view engine", "ejs"); // Set the view engine to EJS

// Route handling
app.use('/', index); // Use index routes
app.use('/dashboard', dashboard); // Use dashboard routes
app.use('/', auth); // Use authentication routes

// Serve log files
const LOGSURL = process.env.LOGSURL;
app.get(LOGSURL, async (req, res) => {
  const logDir = path.join(process.cwd(), 'logs');
  const combinedLogPath = path.join(logDir, 'combined.log');
  const errorLogPath = path.join(logDir, 'error.log');

  try {
    // Read combined log file
    const combinedData = await fs.readFile(combinedLogPath, 'utf8');
    // Read error log file
    const errorData = await fs.readFile(errorLogPath, 'utf8');

    // Send both log contents as a response
    res.send(`
      <h1>Combined Log</h1>
      <pre>${combinedData}</pre>
      <h1>Error Log</h1>
      <pre>${errorData}</pre>
    `);
  } catch (err) {
    logger.error(`Failed to read logs: ${err.message}`);
    return res.status(500).send('Failed to read logs');
  }
});

// 404 error handling
app.use('*', (req, res) => {
  const locals = {
    title: "Page Not Found",
    isLoggedIn: req.isAuthenticated() // Check if the user is authenticated
  };

  // Log the access attempt
  logger.info(`404 page accessed by user: ${req.user ? req.user._id : 'Guest'}`);
  
  res.status(404).render('404', locals); // Render the 404 page with locals
});

// Start the server
const PORT = process.env.PORT || 4000; // Use the specified port or default to 4000
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Log the server start message
});
