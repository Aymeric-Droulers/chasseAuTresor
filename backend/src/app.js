// src/app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./config/db');
//const userRoutes = require('./routes/userRoutes');
const routes = require('./routes/routes');

const app = express();

// 1. Connexion à MongoDB
connectDB();

// 2. Middleware pour parser le JSON
app.use(bodyParser.urlencoded({ extended: true }));

// 3. Configuration CORS
app.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 4. Configuration de session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/', (req, res) => {
  const sessionData = req.session;

  // Access session data
  console.log("Test de la session Data : ");
  console.log(sessionData);
});

// 5. Brancher les routes API
app.use('/api', routes);

// 6. Servir les fichiers statiques
app.use(express.static(path.resolve(__dirname, '../../')));

// 7. Rediriger la route '/' vers le fichier accueil.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../accueil.html'));
});

module.exports = app;
