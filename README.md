Expense Tracker
A full-stack, responsive expense management web application built using the MERN stack (MongoDB, Express, React, Node.js). This app allows users to seamlessly track income and expenses, analyze financial summaries, and securely manage their personal budgets.

Live Demo
Check out the live application hosted on Render:

Live Demo Link : https://expense-tracker-z0jr.onrender.com

Features
User Authentication: Secure user registration and login functionality utilizing JWT (JSON Web Tokens).

Expense & Income Tracking: Add, edit, and delete income or expense entries with categories and custom descriptions.

Financial Analytics: Visual graphs and balance summaries to keep track of spending habits.

Unified Single-Server Architecture: Express server directly serves the compiled React frontend production build alongside API endpoints.

Cloud Database: Integrated with MongoDB Atlas for persistent cloud storage.

Tech Stack
Frontend
React.js (Vite build setup)

Axios (API communication)

CSS / Tailwind CSS (Styling & layout)

Backend
Node.js & Express.js (REST API & static production file serving)

MongoDB & Mongoose (Database modeling and storage)

JSON Web Token (JWT) & Bcrypt.js (Authentication & password hashing)

Project Structure
Plaintext
Expense_Tracker/
├── backend/
│   ├── dist/               # Compiled React production build
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Express application entry point
│   └── package.json
└── expense-tracker/        # React source code & components
Getting Started Locally
Prerequisites
Node.js installed on your local machine

MongoDB Atlas account or local MongoDB instance

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/Ram1792/-Expense-Tracker.git
cd Expense_Tracker
Backend Setup:

Bash
cd backend
npm install
Create a .env file in the backend/ directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
Frontend Setup:

Bash
cd ../expense-tracker
npm install
npm run dev
Run Backend Server:

Bash
cd ../backend
npm run dev  # or node server.js
Deployment
This application is configured for deployment as a unified web service on Render:

The frontend static build (dist) is served by Express via app.use(express.static(...)).

All unmatched route requests default to index.html for single-page client routing.

Database services are managed remotely via MongoDB Atlas.
