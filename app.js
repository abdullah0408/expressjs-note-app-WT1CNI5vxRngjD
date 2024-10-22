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
import logger from "./logger.js"; // Import your logger

config();

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info(`${req.method} request to ${req.url}`);
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Route handling
app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/', auth); 

// 404 error handling
app.use('*', (req, res) => {
  res.status(404).render('404');
}); 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Use logger here instead of console.log
});      
