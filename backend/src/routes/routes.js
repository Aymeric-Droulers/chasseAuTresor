// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers,getUserById} = require('../controllers/userControllers');

// GET /api/users
router.get('/accounts', getAllUsers);
router.get('/accounts/:id', getUserById);

// POST /api/users
//router.post('/accounts/accountX', createUser);

module.exports = router;