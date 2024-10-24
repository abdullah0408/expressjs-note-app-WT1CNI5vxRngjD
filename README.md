# expressjs-note-app-WT1CNI5vxRngjD

## Project Overview
The Note-Taking Web App is a web application that allows users to create, view, update, and delete notes. Users can log in using their Google account, and their notes are stored securely in a MongoDB database. The application features a user-friendly interface built with EJS layouts.

## Technologies Used
- **Frontend**: EJS (Embedded JavaScript), HTML, CSS (Tailwind CSS)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Logging**: Winston

## Features
- User authentication with Google OAuth 2.0
- Create, view, update, and delete notes
- Pagination for viewing notes
- Search functionality for finding notes by title or body
- Responsive design with EJS layouts

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/abdullah0408/expressjs-note-app-WT1CNI5vxRngjD.git
   cd note-taking-web-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of the project and add the following variables:
   ```
   PORT=your_port_number
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CALLBACK_URL=your_callback_url
   SESSION_SECRET=your_session_secret
   LOGSURL=your_logs_url
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

## Usage
- Navigate to `http://localhost:3000` in your web browser.
- Click on the "Login with Google" button to authenticate.
- After logging in, you will be redirected to the dashboard where you can manage your notes.
- Use the "Add Note" feature to create new notes.
- You can view, update, and delete your notes from the dashboard.

## Folder Structure
```plaintext
note-taking-web-app/
├── public/
│   └── stylesheets/
│       └── main.css
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   └── indexController.js
│   ├── middleware/
│   │   └── checkAuth.js
│   ├── models/
│   │   ├── Notes.js
│   │   └── User.js
│   └── routes/
│       ├── auth.js
│       ├── dashboard.js
│       └── index.js
├── views/
│   ├── dashboard/
│   │   ├── add.ejs
│   │   ├── index.ejs
│   │   ├── search.ejs
│   │   └── view-note.ejs
│   ├── layouts/
│   │   ├── dashboard.ejs
│   │   ├── front-page.ejs
│   │   └── main.ejs
│   └── partials/
│       ├── footer_dashboard.ejs
│       ├── footer.ejs
│       ├── header_dashboard.ejs
│       ├── header.ejs
│       ├── 404.ejs
│       ├── index_dashboard.ejs
│       └── index.ejs
├── .env
├── .gitignore
├── app.js
├── logger.js
├── logsView.js
├── package.json
└── README.md
```

## Contributing
Contributions are welcome! If you have suggestions for improvements or features, feel free to create an issue or submit a pull request.
