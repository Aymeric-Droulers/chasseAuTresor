// src/app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const routes = require('./routes/routes');

const app = express();

// 1. Connexion à MongoDB
connectDB();

// 2. Middleware pour parser le JSON
app.use(express.json());

// 3. Configuration CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 4. Configuration de session
app.use(session({
  secret: 'votreSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
    secure: false
  }
}));

// 5. Brancher les routes API
app.use('/api', userRoutes);
app.use('/api', routes);

// 6. Servir les fichiers statiques
app.use(express.static(path.resolve(__dirname, '../../')));

// 7. Rediriger la route '/' vers le fichier accueil.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../accueil.html'));
});

module.exports = app;
