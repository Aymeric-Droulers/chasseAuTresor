// src/app.js
const express = require('express');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/routes');
const cors=require("cors");


const app = express();

// Middleware pour parser les JSON
app.use(express.json());
//autoriser toutes les origines
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    credentials: true, // Autoriser les cookies ou credentials
};

app.use(cors(corsOptions));
// Routes
app.use('/api', userRoutes);

// Connexion à MongoDB
connectDB();

module.exports = app;
