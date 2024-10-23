import mongoose from "mongoose"; // Import mongoose for database interaction
import logger from "../../logger.js"; // Import the logger for logging activities

const Schema = mongoose.Schema;

// Define the schema for the User model
const UserSchema = new Schema({
    googleId: {
        type: String, // Google ID of the user
        required: true // This field is mandatory
    },
    displayName: {
        type: String, // User's display name
        required: true // This field is mandatory
    },
    firstName: {
        type: String, // User's first name
        required: true // This field is mandatory
    },
    lastName: {
        type: String, // User's last name (optional)
    },
    profileImage: {
        type: String, // URL of the user's profile image
        required: true // This field is mandatory
    },
    createdAt: {
        type: Date, // Timestamp for when the user was created
        default: Date.now // Set to the current date/time by default
    }
});

// Static method to create a new user with logging
UserSchema.statics.createUser = async function(userData) {
    const user = new this(userData); // Create a new user instance
    await user.save(); // Save the user to the database
    logger.info(`New user created: ${user.displayName} (ID: ${user.googleId})`); // Log user creation
    return user; // Return the created user
};

// Create the User model based on the schema
const User = mongoose.model('User', UserSchema);

export default User; // Export the User model
