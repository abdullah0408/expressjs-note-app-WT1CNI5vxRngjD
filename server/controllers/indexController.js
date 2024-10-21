
const homepage = (req, res) => {
    const locals = {
        title: "Home"
    };
    res.render("index", {
        locals,
        layout: '../views/layouts/front-page.ejs',
    }); // Renders the "index" template with locals
};

const about = (req, res) => {
    const locals = {
        title: "About Us" // Changed the title to reflect the About page
    };
    res.render("about", locals); // Assuming you have an "about.ejs" or similar template
};


export { homepage, about};
