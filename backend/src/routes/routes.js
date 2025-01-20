// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers,getUserById,addAccount} = require('../controllers/userControllers');

// GET /api/users
router.get('/accounts', getAllUsers);
router.post('/accounts/addAccount', addAccount);
router.get('/accounts/:id', getUserById);

// POST /api/users
//router.post('/accounts/accountX', createUser);

module.exports = router;