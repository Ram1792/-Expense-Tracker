Expense Tracker
A full-stack web application for tracking personal income and expenses. Built using the MERN stack (MongoDB, Express.js, React, Node.js), it provides real-time financial updates, user authentication, and interactive balance tracking within a single unified platform.

Live Demo
Access the live application hosted on Render:

Expense Tracker Web App:

Key Features
User Authentication: Secure user signup and login using JSON Web Tokens (JWT) and encrypted passwords.

Transaction Management: Easily log, edit, and delete income and expense records with custom categories.

Financial Summary: Dynamic tracking of total income, overall expenses, and remaining balance.

Unified Deployment: Single-server setup where Express serves both API routes and the compiled React static build.

Cloud Database: Persistent, multi-user data storage powered by MongoDB Atlas.

Tech Stack
Frontend: React (Vite), Axios, CSS

Backend: Node.js, Express.js

Database: MongoDB Atlas (via Mongoose)

Authentication: JWT, Bcrypt.js

Hosting: Render

Project Structure
Plaintext
Expense_Tracker/
├── backend/
│   ├── dist/           # Production build of the React frontend
│   ├── models/         # Database models (User, Expense, Income)
│   ├── routes/         # Express API routes
│   └── server.js       # Express server entry point
└── expense-tracker/    # React source files and components

Local Setup
1. Clone the Repository
Bash
git clone https://github.com/Ram1792/-Expense-Tracker.git
cd Expense_Tracker
2. Configure Backend
Bash
cd backend
npm install
Create a .env file in the backend directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
3. Build & Run
Bash
# Build the frontend assets inside expense-tracker
cd ../expense-tracker
npm install
npm run build

# Start the Express server
cd ../backend
node server.js

