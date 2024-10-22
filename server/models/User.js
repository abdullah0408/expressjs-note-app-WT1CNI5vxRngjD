import mongoose from "mongoose";
import logger from "../../logger.js"; // Import the logger

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,    
    },
    profileImage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Function to log user creation explicitly
UserSchema.statics.createUser = async function(userData) {
    const user = new this(userData);
    await user.save();
    logger.info(`New user created: ${user.displayName} (ID: ${user.googleId})`);
    return user;
};

const User = mongoose.model('User', UserSchema);

export default User;
