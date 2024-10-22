import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';
import logger from '../../logger.js'; // Import your logger

dotenv.config(); // Load environment variables from the .env file

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  async function(accessToken, refreshToken, profile, done) {
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value
    };

    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            logger.info(`User logged in: ${user.displayName}`);
            done(null, user);
        } else {
            user = await User.create(newUser);
            logger.info(`New user created: ${user.displayName}`);
            done(null, user);
        }
    } catch (error) {
        logger.error(`Error during authentication: ${error.message}`);
        done(error);
    }
}));

const auth = express.Router();

auth.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

auth.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failed', 
        successRedirect: '/dashboard'
    }),
);

auth.get('/login-failed', (req, res) => {
    logger.warn('Login attempt failed');
    res.send('Failed to login');
});

auth.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            logger.error(`Logout error: ${err.message}`);
            res.send('Failed to logout');
        } else {
            logger.info('User logged out');
            res.redirect('/');
        }
    });
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        logger.error(`Deserialization error: ${err.message}`);
        done(err);
    }
});

export default auth;
