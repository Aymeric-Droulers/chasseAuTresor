// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  addAccount,
  getUserByMail
} = require('../controllers/userControllers');
const {
  getAllChasses,
  getChasseById,
  addChasse,
  getChasseSteps,
  getChasseStep,
  addStep,
  getChasseTeams,
  getChasseTeam
} = require('../controllers/chasseControllers');

// ROUTES UTILISATEURS
router.get('/accounts', getAllUsers);
router.post('/accounts/addAccount', addAccount);
router.get('/accounts/:id', getUserById);
router.get('/accounts/getByMail/:mail', getUserByMail);

// ROUTE DE LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@test.com' && password === '1234') {
    req.session.user = { email };
    return res.json({ success: true, message: 'Connecté !' });
  }
  return res.status(401).json({ success: false, message: 'Identifiants invalides' });
});

// ROUTE DE LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de déconnexion' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Déconnecté !' });
  });
});

// ROUTES CHASSES
router.get('/chasses', getAllChasses);
router.get('/chasses/:id', getChasseById);
router.get('/chasses/:id/allSteps', getChasseSteps);
router.get('/chasses/:id/allSteps/:step', getChasseStep);
router.post('/chasses/:id/addStep', addStep);
router.get('/chasses/:id/allTeams', getChasseTeams);
router.get('/chasses/:id/allTeams/:team', getChasseTeam);
router.post('/chasses/addChasse', addChasse);

module.exports = router;
