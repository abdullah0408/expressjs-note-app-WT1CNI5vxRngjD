const dashboardPage = (req, res) => {
    const locals = {
        title: "dashboard" // Changed the title to reflect the About page
    };
    res.render("dashboard/index", {
        locals,
        layout: '../views/layouts/dashboard.ejs',
    }); // Assuming you have an "about.ejs" or similar template
};

export { dashboardPage };