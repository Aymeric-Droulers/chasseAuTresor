const { addTeam, getAllTeams } = require('../controllers/chasseControllers');
const { joinTeamByCode } = require('../controllers/chasseControllers');


// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers,getUserById,addAccount, getUserByMail} = require('../controllers/userControllers');
const {getAllChasses, getChasseById, addChasse,getChasseSteps,getChasseStep, addStep, getChasseTeams, getChasseTeam,
    editChasse, getPlayerList, getPlayerInPlayerList, addPlayer, addTeam, getTeamProgress
}=require('../controllers/chasseControllers');
const {login, logout} = require("../controllers/authControllers");


// auth routes

router.post('/login', login);
router.post('/logout', logout);

//  /api/users
router.get('/accounts', getAllUsers);
router.post('/accounts/addAccount', addAccount);
router.get('/accounts/:id', getUserById);
router.get("/accounts/getByMail/:mail",getUserByMail);

router.post('/teams', addTeam); // Ajoute une équipe sans référence à une chasse
router.get('/teams', getAllTeams); // Récupère toutes les équipes
router.post('/teams/join', joinTeamByCode); // Route pour rejoindre une équipe avec un code



//   /api/chasses

router.get('/chasses',getAllChasses);
router.get('/chasses/:id', getChasseById);
router.put('/chasses/:id/edit',editChasse);
router.get('/chasses/:id/allSteps',getChasseSteps);
router.get('/chasses/:id/allSteps/:step',getChasseStep);
router.post('/chasses/:id/addStep',addStep)
router.post('/chasses/:id/addTeam',addTeam)
router.get('/chasses/:id/allTeams',getChasseTeams);
router.get('/chasses/:id/allTeams/:team',getChasseTeam);
router.get('/chasses/:id/allTeams/:team/playerList',getPlayerList);
router.get('/chasses/:id/allTeams/:team/playerList/:player',getPlayerInPlayerList);
router.post('/chasses/:id/allTeams/:team/addPlayer',addPlayer)
router.get('/chasseS/:id/allTeams/:team/teamProgress',getTeamProgress)
router.post('/chasses/addChasse', addChasse);


module.exports = router;