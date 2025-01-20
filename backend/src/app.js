// src/app.js
const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/routes');
const cors=require("cors");


const app = express();

// Middleware pour parser les JSON
app.use(express.json());
//autoriser toutes les origines
app.use(cors());
// Routes
app.use('/api', userRoutes);

// Connexion à MongoDB
connectDB();

module.exports = app;
