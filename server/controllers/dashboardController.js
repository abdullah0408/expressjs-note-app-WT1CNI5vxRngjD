import Note from "../models/Notes.js";
import mongoose from "mongoose";
import logger from "../../logger.js";

const dashboardPage = async (req, res, next) => {
    let perPage = 12;
    let page = req.query.page || 1;
    const locals = {
        title: "dashboard"
    };

    try {
        const notes = await Note.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] }
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Note.countDocuments({ user: req.user._id });

        res.render("dashboard/index", {
            userName: req.user.displayName,
            locals,
            notes,
            layout: '../views/layouts/dashboard.ejs',
            current: page,
            pages: Math.ceil(count / perPage)
        });

    } catch (error) {
        logger.error('Error in dashboardPage: ', error); // Log the error
        next(error); // Ensure the error is passed to the error-handling middleware
    }
};

const dashboardPageViewNote = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id }).lean();

        if (note) {
            res.render("dashboard/view-note", {
                noteID: req.params.id,
                note,
                layout: '../views/layouts/dashboard.ejs'
            });
        } else {
            logger.warn(`Note not found: ${req.params.id} for user: ${req.user._id}`); // Log a warning
            res.send("Note not found");
        }
    } catch (error) {
        logger.error('Error in dashboardPageViewNote: ', error); // Log the error
        res.send("An error occurred while retrieving the note.");
    }  
};

const dashboardPageUpdateNote = async (req, res) => {
    try {
        await Note.findByIdAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                body: req.body.body,
                updatedAt: Date.now()
            },
            { new: true }
        ).where({ user: req.user._id });

        logger.info(`Note updated: ${req.params.id} by user: ${req.user._id}`); // Log info on update
        res.redirect("/dashboard");
    } catch (error) {
        logger.error('Error in dashboardPageUpdateNote: ', error); // Log the error
    }
};

const dashboardPageDeleteNote = async (req, res) => {
    try {
        await Note.deleteOne({ _id: req.params.id }).where({ user: req.user._id });
        logger.info(`Note deleted: ${req.params.id} by user: ${req.user._id}`); // Log info on delete
        res.redirect("/dashboard");
    } catch (error) {
        logger.error('Error in dashboardPageDeleteNote: ', error); // Log the error
    }
};

const dashboardAddNote = (req, res) => {
    res.render("dashboard/add", {
        layout: '../views/layouts/dashboard.ejs'
    });
};

const dashboardPageSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body);

        logger.info(`New note created by user: ${req.user._id}`); // Log info on note creation
        res.redirect("/dashboard");
    } catch (error) {
        logger.error('Error in dashboardPageSubmit: ', error); // Log the error
    }
};

const dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResults: "",
            layout: '../views/layouts/dashboard.ejs'
        });
    } catch (error) {
        logger.error('Error in dashboardSearch: ', error); // Log the error
    }
};

const dashboardSearchSumbit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars), $options: 'i' } },
                { body: { $regex: new RegExp(searchNoSpecialChars), $options: 'i' } }
            ]
        }).where({ user: req.user._id });

        logger.info(`Search performed by user: ${req.user._id} for term: ${searchTerm}`); // Log info on search
        res.render("dashboard/search", {
            searchResults,
            layout: '../views/layouts/dashboard.ejs'
        });

    } catch (error) {
        logger.error('Error in dashboardSearchSumbit: ', error); // Log the error
    }
};

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
