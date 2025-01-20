// src/app.js
const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/routes');



const app = express();

// Middleware pour parser les JSON
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Connexion à MongoDB
connectDB();

module.exports = app;
