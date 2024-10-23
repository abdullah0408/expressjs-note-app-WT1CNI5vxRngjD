import express from 'express'; // Import Express for routing
import passport from 'passport'; // Import Passport for authentication
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Google OAuth 2.0 Strategy for Passport
import dotenv from 'dotenv'; // Import dotenv to load environment variables
import User from '../models/User.js'; // Import the User model
import logger from '../../logger.js'; // Import your logger for logging activities

dotenv.config(); // Load environment variables from the .env file

// Configure Passport to use Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Google Client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret from environment variables
    callbackURL: process.env.CALLBACK_URL, // Callback URL after Google authentication
  },
  async function(accessToken, refreshToken, profile, done) {
    // Extract user profile information from Google
    const newUser = {
        googleId: profile.id, // Google ID of the user
        displayName: profile.displayName, // User's display name
        firstName: profile.name.givenName, // User's first name
        lastName: profile.name.familyName, // User's last name
        profileImage: profile.photos[0].value // URL of the user's Google profile image
    };

    try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            logger.info(`User logged in: ${user.displayName}`); // Log the login
            done(null, user); // If user exists, complete authentication
        } else {
            // Create a new user if they don't exist in the database
            user = await User.create(newUser);
            logger.info(`New user created: ${user.displayName}`); // Log new user creation
            done(null, user); // Complete authentication with the new user
        }
    } catch (error) {
        logger.error(`Error during authentication: ${error.message}`); // Log any errors during the authentication process
        done(error); // Pass the error to Passport's done callback
    }
}));

// Initialize the Express Router for authentication routes
const auth = express.Router();

// Route for initiating Google OAuth authentication
auth.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] }) // Request user's email and profile from Google
);

// Callback route after Google authentication
auth.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failed', // Redirect to /login-failed if authentication fails
        successRedirect: '/dashboard' // Redirect to /dashboard on successful authentication
    }),
);

// Route for login failure
auth.get('/login-failed', (req, res) => {
    logger.warn('Login attempt failed'); // Log the failed login attempt
    res.send('Failed to login'); // Send a failure message
});

// Route for logging out the user
auth.get('/logout', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy(err => {
        if (err) {
            logger.error(`Logout error: ${err.message}`); // Log any error during logout
            res.send('Failed to logout'); // Send a failure message if logout fails
        } else {
            logger.info('User logged out'); // Log successful logout
            res.redirect('/'); // Redirect to the homepage after logout
        }
    });
});

// Serialize the user ID to store in the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize the user by storing their ID in the session
});

// Deserialize the user by retrieving their data from the database using their ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find the user in the database by ID
        done(null, user); // Return the user object to be attached to the request
    } catch (err) {
        logger.error(`Deserialization error: ${err.message}`); // Log any errors during deserialization
        done(err); // Pass the error to Passport's done callback
    }
});

export default auth; // Export the auth router
