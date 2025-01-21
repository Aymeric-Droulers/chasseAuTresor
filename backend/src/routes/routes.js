// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers,getUserById,addAccount, getUserByMail} = require('../controllers/userControllers');
const {getAllChasses, getChasseById, addChasse,getChasseSteps}=require('../controllers/chasseControllers');

//  /api/users
router.get('/accounts', getAllUsers);
router.post('/accounts/addAccount', addAccount);
router.get('/accounts/:id', getUserById);
router.get("/accounts/getByMail/:mail",getUserByMail);

//   /api/chasses

router.get('/chasses',getAllChasses);
router.get('/chasses/:id', getChasseById);
router.get('/chasses/:id/allSteps',getChasseSteps);
router.post('/chasses/addChasse', addChasse);


module.exports = router;