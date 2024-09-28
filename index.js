const express = require('express');
const connectDatabase = require('./config/databseConfig'); // Fixed typo in 'databaseConfig'
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Port definition
const PORT = process.env.PORT || 5000;

// API routes
app.use("/shopify/users", authRoutes);

// Database connection
connectDatabase();

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Server instance
app.listen(PORT, () => {
    console.log(`Server up and running on port number ${PORT}`);
});
