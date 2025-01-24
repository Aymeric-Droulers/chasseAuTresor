// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const { getAllUsers,getUserById,addAccount, getUserByMail, getUserChassesParticipated, getUserChassesCreated,
    addChasseParticipated, addChasseCreated
} = require('../controllers/userControllers');

const {getAllChasses, getChasseById, addChasse,getChasseSteps,getChasseStep, addStep, getChasseTeams, getChasseTeam,
    editChasse, getPlayerList, getPlayerInPlayerList, addPlayer, addTeam, getTeamProgress, validateStepInProgress,
    addMapImg, getChasseMapImg ,joinTeamByCode 
}=require('../controllers/chasseControllers');

const {login, logout, getSession} = require("../controllers/authControllers");

const upload = require('../config/uploadConfig');

router.get('/teams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const team = await db.collection('Teams').findOne({ _id: new ObjectId(id) });
        if (!team) return res.status(404).json({ error: 'Équipe introuvable.' });
        res.status(200).json(team);
    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});


// auth routes
router.post('/login', login);
router.post('/logout', logout);
router.get('/session',getSession);

//  /api/users
router.get('/accounts', getAllUsers);
router.post('/accounts/addAccount', addAccount);
router.get('/accounts/:id', getUserById);
router.get("/accounts/getByMail/:mail",getUserByMail);
router.get("/accounts/:id/allChassesParticipated", getUserChassesParticipated);
router.get("/accounts/:id/allChassesCreated", getUserChassesCreated);
router.post("/accounts/:id/addChasseParticipated",addChasseParticipated);
router.post("/accounts/:id/addChasseCreated",addChasseCreated);

//   /api/chasses
router.get('/chasses',getAllChasses);
router.get('/chasses/:id', getChasseById);
router.put('/chasses/:id/edit',editChasse);
router.get('/chasses/:id/allSteps',getChasseSteps);
router.get('/chasses/:id/allSteps/:step',getChasseStep);
router.post('/chasses/:id/addStep',addStep)
router.post('/chasses/:id/addTeam', addTeam);
router.get('/chasses/:id/allTeams',getChasseTeams);
router.get('/chasses/:id/allTeams/:team',getChasseTeam);
router.get('/chasses/:id/allTeams/:team/playerList',getPlayerList);
router.post('/chasses/joinTeamByCode', joinTeamByCode);
router.get('/chasses/:id/allTeams/:team/playerList/:player',getPlayerInPlayerList);
router.post('/chasses/:id/allTeams/:team/addPlayer',addPlayer)
router.get('/chasses/:id/allTeams/:team/teamProgress',getTeamProgress)
router.post('/chasses/:id/allTeams/:team/validateStepInProgress',validateStepInProgress)
router.post('/chasses/addChasse', addChasse);
router.post('/chasses/:id/addMapImg', upload.single('image'),addMapImg)
router.get('/chasses/:id/getMapImg',getChasseMapImg)

module.exports = router;