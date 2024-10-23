import mongoose from "mongoose"; // Import mongoose for database interaction
import logger from "../../logger.js"; // Import the logger for logging activities

const Schema = mongoose.Schema;

// Define the schema for the Note model
const NoteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Link to the User model
        ref: 'User' // Reference the User collection
    },
    title: {
        type: String, // Note title
        required: true // Title is mandatory
    },
    body: {
        type: String, // Note body content
    },
    createdAt: {
        type: Date, // Date when the note was created
        default: Date.now // Default to current date/time
    },
    updatedAt: {
        type: Date, // Date when the note was last updated
        default: Date.now // Default to current date/time
    }
});

// Static method to create a note with logging
NoteSchema.statics.createNote = async function(noteData) {
    const note = new this(noteData); // Create a new note instance
    await note.save(); // Save the note to the database
    logger.info(`Note created: ${note.title}, User: ${note.user}`); // Log the note creation
    return note; // Return the created note
};

// Instance method to update a note with logging
NoteSchema.methods.updateNote = async function(updateData) {
    // Update the note's fields and set updatedAt to the current time
    Object.assign(this, updateData, { updatedAt: Date.now() }); 
    await this.save(); // Save the updated note
    logger.info(`Note updated: ${this.title}, User: ${this.user}`); // Log the note update
    return this; // Return the updated note
};

// Create the Note model based on the schema
const Note = mongoose.model('Note', NoteSchema);

export default Note; // Export the Note model
