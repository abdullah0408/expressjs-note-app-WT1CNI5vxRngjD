import { config } from "dotenv";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import index from "./server/routes/index.js";
import dashboard from "./server/routes/dashboard.js";


config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use('/', index);
app.use('/dashboard', dashboard);


// app.use('*', (req, res) => {
//   res.status(404).render('404');
// }); 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});     