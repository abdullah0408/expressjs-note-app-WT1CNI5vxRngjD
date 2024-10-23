import Note from "../models/Notes.js"; // Import the Note model
import mongoose from "mongoose"; // Import mongoose for MongoDB interactions
import logger from "../../logger.js"; // Import logger for logging purposes

// Render the dashboard page with notes
const dashboardPage = async (req, res, next) => {
    const perPage = 12; // Number of notes per page
    const page = req.query.page || 1; // Get the current page from query params
    const locals = {
        title: "Dashboard | Notes" // Set the page title
    };

    try {
        // Fetch notes for the logged-in user, sorted by updatedAt date
        const notes = await Note.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id) // Match notes for the user
                }
            },
            {
                $sort: { updatedAt: -1 } // Sort notes by updated date, descending
            },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] }, // Limit title to 30 characters
                    body: { $substr: ["$body", 0, 200] } // Limit body to 200 characters
                }
            }
        ])
        .skip(perPage * page - perPage) // Skip notes for previous pages
        .limit(perPage) // Limit the number of notes returned
        .exec();

        // Count the total number of notes for the user
        const count = await Note.countDocuments({ user: req.user._id });

        // Render the dashboard with notes and pagination
        res.render("dashboard/index", {
            userName: req.user.displayName, // Display user's name
            locals,
            notes,
            layout: '../views/layouts/dashboard.ejs', // Layout for the dashboard
            current: page, // Current page number
            pages: Math.ceil(count / perPage) // Total number of pages
        });

    } catch (error) {
        logger.error('Error in dashboardPage: ', error); // Log the error
        next(error); // Pass the error to the next middleware
    }
};

// Render a specific note's details
const dashboardPageViewNote = async (req, res) => {
    try {
        // Find the note by ID and ensure it belongs to the user
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id }).lean();

        if (note) {
            const locals = {
                title: `View | ${note.title || "Note"}` // Set the page title based on the note title
            };

            // Render the note view if found
            res.render("dashboard/view-note", {
                noteID: req.params.id, // Pass note ID
                note,
                layout: '../views/layouts/dashboard.ejs', // Layout for the dashboard
                locals // Pass locals for rendering
            });
        } else {
            logger.warn(`Note not found: ${req.params.id} for user: ${req.user._id}`); // Log a warning
            res.send("Note not found"); // Send a not found message
        }
    } catch (error) {
        logger.error('Error in dashboardPageViewNote: ', error); // Log the error
        res.send("An error occurred while retrieving the note."); // Send error message
    }  
};

// Update a specific note
const dashboardPageUpdateNote = async (req, res) => {
    try {
        await Note.findByIdAndUpdate(
            { _id: req.params.id }, // Find the note by ID
            {
                title: req.body.title, // Update title
                body: req.body.body, // Update body
                updatedAt: Date.now() // Update the timestamp
            },
            { new: true } // Return the updated document
        ).where({ user: req.user._id }); // Ensure it belongs to the user

        logger.info(`Note updated: ${req.params.id} by user: ${req.user._id}`); // Log info on update
        res.redirect("/dashboard"); // Redirect to dashboard
    } catch (error) {
        logger.error('Error in dashboardPageUpdateNote: ', error); // Log the error
    }
};

// Delete a specific note
const dashboardPageDeleteNote = async (req, res) => {
    try {
        await Note.deleteOne({ _id: req.params.id }).where({ user: req.user._id }); // Delete the note
        logger.info(`Note deleted: ${req.params.id} by user: ${req.user._id}`); // Log info on delete
        res.redirect("/dashboard"); // Redirect to dashboard
    } catch (error) {
        logger.error('Error in dashboardPageDeleteNote: ', error); // Log the error
    }
};

// Render the add note page
const dashboardAddNote = (req, res) => {
    const locals = {
        title: "Add | Note" // Set the page title for adding a note
    };

    res.render("dashboard/add", {
        layout: '../views/layouts/dashboard.ejs', // Layout for the dashboard
        locals // Pass locals for rendering
    });
};


// Submit a new note
const dashboardPageSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id; // Attach user ID to the note
        await Note.create(req.body); // Create a new note

        logger.info(`New note created by user: ${req.user._id}`); // Log info on note creation
        res.redirect("/dashboard"); // Redirect to dashboard
    } catch (error) {
        logger.error('Error in dashboardPageSubmit: ', error); // Log the error
    }
};

// Render the search page
const dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResults: "", // Placeholder for search results
            layout: '../views/layouts/dashboard.ejs' // Layout for the dashboard
        });
    } catch (error) {
        logger.error('Error in dashboardSearch: ', error); // Log the error
    }
};

// Perform a search for notes
const dashboardSearchSumbit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm; // Get the search term from the request
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters

        // Find notes matching the search term in title or body
        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars), $options: 'i' } },
                { body: { $regex: new RegExp(searchNoSpecialChars), $options: 'i' } }
            ]
        })
        .where({ user: req.user._id }) // Ensure results belong to the user
        .sort({ updatedAt: -1 }) // Sort results by updated date, descending
        .select({
            title: 1, // Select title
            body: { $substr: ["$body", 0, 200] }, // Limit body to 200 characters
            updatedAt: 1 // Select updatedAt
        });

        logger.info(`Search performed by user: ${req.user._id} for term: ${searchTerm}`); // Log info on search

        const locals = {
            title: `Search Results for "${searchTerm} | Notes"` // Set the page title dynamically
        };

        res.render("dashboard/search", {
            searchResults, // Pass search results to the view
            layout: '../views/layouts/dashboard.ejs', // Layout for the dashboard
            locals // Pass locals for rendering
        });

    } catch (error) {
        logger.error('Error in dashboardSearchSumbit: ', error); // Log the error
        res.send("An error occurred while searching for notes."); // Send error message
    }
};


// Export dashboard functions for use in routes
export {
    dashboardPage,
    dashboardPageViewNote,
    dashboardPageUpdateNote,
    dashboardPageDeleteNote,
    dashboardAddNote,
    dashboardPageSubmit,
    dashboardSearch,
    dashboardSearchSumbit
};
