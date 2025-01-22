// src/app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 1. Connexion BDD
connectDB();

// 2. Middlewares de base
app.use(express.json());

// 3. Configuration CORS
//    Choisis l'URL EXACTE où tu ouvres ton front.
//    Si tu ouvres http://localhost:5500/accueil.html, alors :
app.use(cors({
  origin: 'http://localhost:5500',  
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true 
}));

/* 
   Si tu préfères 127.0.0.1, alors mets :
app.use(cors({
  origin: 'http://127.0.0.1:5500',  
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true 
}));
*/

// 4. Configuration de session
app.use(session({
  secret: 'votreSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none', // indispensable en cross-origin
    secure: false     // false si en local http, true en HTTPS prod
  }
}));

// 5. Brancher tes routes
app.use('/api', userRoutes);

// 6. Servir le dossier "chasseautresor" (où se trouve accueil.html, etc.)
app.use(express.static(path.join(__dirname, '../chasseautresor')));

module.exports = app;
