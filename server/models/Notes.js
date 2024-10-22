import mongoose from "mongoose";
import logger from "../../logger.js"; // Import the logger

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Function to create a note with logging
NoteSchema.statics.createNote = async function(noteData) {
    const note = new this(noteData);
    await note.save();
    logger.info(`Note created: ${note.title}, User: ${note.user}`);
    return note;
};

// Function to update a note with logging
NoteSchema.methods.updateNote = async function(updateData) {
    Object.assign(this, updateData, { updatedAt: Date.now() }); // Update fields
    await this.save();
    logger.info(`Note updated: ${this.title}, User: ${this.user}`);
    return this;
};

const Note = mongoose.model('Note', NoteSchema);

export default Note;
