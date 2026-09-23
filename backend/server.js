const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

const path = require('path');
// Serve static files from the React dist build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle single-page app routing (Express v5 safe catch-all)
app.use((req, res, next) => {
  // If request is an API route that wasn't matched above, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  // Otherwise, serve index.html for React Router
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// DB Connection & Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

