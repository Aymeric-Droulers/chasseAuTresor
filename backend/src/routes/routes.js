// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers,getUserById,addAccount} = require('../controllers/userControllers');
const {getAllChasses}=require('../controllers/chasseControllers');

//  /api/users
router.get('/accounts', getAllUsers);
router.post('/accounts/addAccount', addAccount);
router.get('/accounts/:id', getUserById);

//   /api/chasses

router.get('/chasses',getAllChasses);

module.exports = router;