// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
//const { getAllUsers, createUser } = require('../controllers/userController');

// GET /api/users
router.get('/users', getAllUsers);

// POST /api/users
router.post('/users', createUser);

module.exports = router;