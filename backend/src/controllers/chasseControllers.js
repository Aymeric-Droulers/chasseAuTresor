const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");
const{validateChasseData}=require('../middleware/validateChasseData');
const {getChasseById} = require("../utils/getChasseById");
const {validateStepData} = require("../middleware/validateStepData");
const {getTeamInChasseByNumber} = require("../middleware/getTeamInChasseByNumber");
const {getPlayerListFromChasseAndNumTeam} = require("../middleware/getPlayerListFromChasseAndNumTeam");
const fs = require('fs');
const path = require("path");
/*
* Récupère toutes les chasses de la collection Chasses
*/
exports.getAllChasses = async (req, res) => {

    try {
        const DB = await getDB();
        const chasses = await DB.collection('Chasses').find().toArray();
        res.status(200).json(chasses);
    }catch(err) {
        res.status(500).json(err);
    }
};
/*
* Récupère la chasse possédant l'id id*/
exports.getChasseById=async (req, res) => {
    try {
        const {id} = req.params;
        const chasse = await getChasseById(id);
        if(!chasse){
            return res.status(404).json({error: 'Chasse not found'});
        }
        res.status(200).json(chasse);
    }catch(err) {
        res.status(500).json(err);
    }
}
/*
*
Renvoie toutes les étapes d'une chasse selon son id
 */
exports.getChasseSteps = async (req, res) => {
    const {id} = req.params;
    const chasse = await getChasseById(id);
    if(!chasse){
        return res.status(404).json({error: 'Chasse not found'});
    }
    res.status(200).json(chasse.steps);
}
/*
*
Renvoie toutes les équipes d'une chasse selon son id
 */
exports.getChasseTeams = async (req, res) => {
    const {id} = req.params;
    const chasse = await getChasseById(id);
    if(!chasse){
        return res.status(404).json({error: 'Chasse not found'});
    }
    res.status(200).json(chasse.playingTeams);
}
/*
 * Récupère l'étape step de la chasse id
 */
exports.getChasseStep = async (req, res) => {
    const {id,step} = req.params;
    const chasse = await getChasseById(id);
    if(!chasse){
        return res.status(404).json({error: 'Chasse not found'});
    }
    const listSteps =chasse.steps;
    if(listSteps.length < step){
        return res.status(404).json({error: "Step not found (too High)"});
    }
    if(!listSteps[parseInt(step)-1]){
        return res.status(404).json({error: "Step not found"});
    }

    return res.status(200).json(listSteps[parseInt(step)-1]);
}
exports.getChasseTeam = async (req, res) => {
    const {id,team} = req.params;
    const result =await getTeamInChasseByNumber(id,team);
    if(result.status===false){
        return res.status(400).json({error: result.error});
    }
    return res.status(200).json(result.content);
}
/*
* Ajoute une chasse avec les infos de base
* */
exports.addChasse = async (req, res) => {
    try{
        const {accessCode,name,nbTeams,peopleByTeam,startDate,duration,themes,place,randomDeparture,randomSteps,owner}= req.body;
        const validation = validateChasseData(req.body);

        if(validation.status === false){
            return res.status(400).json({status:false,message:validation.message});
        }

        const insertData = {
            "owner":new ObjectId(owner),
            "name": name,
            "nbTeams":nbTeams,
            "peopleByTeam":peopleByTeam,
            "startDate":startDate,
            "duration":duration,
            "themes":themes,
            "accessCode":accessCode,
            "place":place,
            "mapFile":"",
            "randomDeparture":randomDeparture,
            "randomSteps":randomSteps,
            "steps":[],
            "playingTeams":[]
        }
        const db = getDB();
        const response = await db.collection('Chasses').insertOne(insertData);

        console.log("chasse added");
        res.status(201).json({status:true, message: "Chasse créée",id:response.insertedId });


    }catch(err) {
        res.status(500).json(err);
    }
}
/*
 Modifie une chasse avec les infos de base
* */
exports.editChasse = async (req, res) => {
    try{
        const {accessCode,name,nbTeams,peopleByTeam,startDate,duration,themes,place,randomDeparture,randomSteps}= req.body;
        const {id} = req.params;
        const validation = validateChasseData(req.body);

        if(validation.status === false){
            return res.status(400).json({status:false,message:validation.message});
        }
        const chasse = await getChasseById(id);
        console.log(chasse)
        if(!chasse){
            return res.status(404).json({error: 'Chasse not found'});
        }

        const updateData = {
            "name": name,
            "nbTeams":nbTeams,
            "peopleByTeam":peopleByTeam,
            "startDate":startDate,
            "duration":duration,
            "themes":themes,
            "accessCode":accessCode,
            "place":place,
            "randomDeparture":randomDeparture,
            "randomSteps":randomSteps,
        }
        const objectId = new ObjectId(id);
        const db = getDB();
        const result = await db.collection('Chasses').updateOne(
            {_id:objectId},
            {$set:updateData}
        );
        console.log(result);
        res.status(201).json({status:true, message: "Chasse mis a jour" });


    }catch(err) {
        res.status(500).json(err);
    }
}
/*
Ajoute une étape à une chasse
 */
exports.addStep = async (req, res) => {
    try {
        console.log("a")
        const {id} = req.params;
        const objectId = new ObjectId(id);
        const data = {
            chasseId: objectId,
            stepName: req.body.stepName,
            stepHint: req.body.stepHint,
            stepCode: req.body.stepCode,
            points:req.body.points,
        };


        const validation = await validateStepData(data);
        const chasse = await getChasseById(id);
        let currentSteps = chasse.steps;

        const lastId= currentSteps[currentSteps.length-1].stepId;

        currentSteps.push({
            stepId:lastId+1,
            stepName:req.body.stepName,
            stepHint:req.body.stepHint,
            stepCode:req.body.stepCode,
            points:req.body.points
        })

        if (!validation.success) {
            //update de la chasse
            res.status(400).json({status: false, message: validation.message});
            console.log("les données ne sont pas valides");
        }else{
            const db = getDB();
            await db.collection('Chasses').updateOne(
                { _id: objectId },
                { $set: { steps: currentSteps } }
            );
            console.log("step added");
            res.status(201).json({status:true, message: "Etape ajoutée" });
        }

    }catch (err){
        res.status(500).json(err);
    }
}
/*
* récupère la liste des joueurs et leurs données
* */
exports.getPlayerList = async (req, res) => {
    try {
        const {id, team} = req.params;
        const resultat =await getPlayerListFromChasseAndNumTeam(id,team);

        if(!resultat.status){
            return res.status(400).json({message:resultat.message});
        }else{
            return res.status(200).json(resultat.content);
        }

    }catch (err){
        res.status(500).json(err);
    }

}
exports.getPlayerInPlayerList = async (req, res) => {
    const {id, team,player} = req.params;
    const resultat =await getPlayerListFromChasseAndNumTeam(id,team);
    if(!resultat.status){
        return res.status(400).json({message:resultat.message});
    }else{
        const playerList = resultat.content;
        if(playerList.length < player){
            return res.status(404).json({message:"Player not found (Too high)"});
        }
        if(!playerList[player-1]){
            return res.status(404).json({message:"Player not found"});
        }
        return res.status(200).json(playerList[player-1]);
    }

}
// Ajoute une équipe sans référence à une chasse
exports.addTeam = async (req, res) => {
    try {
        const { teamName, accessCode } = req.body;
        const { id } = req.params; // ID de la chasse

        if (!teamName || teamName.length < 3) {
            return res.status(400).json({ error: "Le nom de l'équipe est invalide." });
        }

        const db = getDB();

        // Récupérer la chasse
        const chasse = await db.collection('Chasses').findOne({ _id: new ObjectId(id) });
        if (!chasse) {
            return res.status(404).json({ error: "Chasse introuvable." });
        }

        // Vérifier si le nombre maximum d'équipes est atteint
        if (chasse.playingTeams.length >= chasse.nbTeams) {
            return res.status(400).json({ error: "Nombre maximum d'équipes atteint." });
        }

        // Ajouter l'équipe dans la collection Teams
        const result = await db.collection('Teams').insertOne({
            teamName,
            teamPlayersIds: [],
            accessCode, // Code d'accès
        });

        // Ajouter cette équipe à playingTeams dans la chasse
        await db.collection('Chasses').updateOne(
            { _id: new ObjectId(id) },
            { $push: { playingTeams: { teamId: result.insertedId, teamName, teamPlayersIds: [], accessCode } } }
        );

        res.status(201).json({ message: "Équipe ajoutée avec succès", teamId: result.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'équipe." });
    }
};



exports.getAllTeams = async (req, res) => {
    try {
        const db = getDB();
        const teams = await db.collection('Teams').find().toArray();

        res.status(200).json(teams);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des équipes.' });
    }
};
exports.addPlayer = async (req, res) => {
    let{id,team}=req.params;
    const{playerId}=req.body;
    const idObject= new ObjectId(id)

    //verifications existence chasse et équipe
    const chasse=await getChasseById(id);
    if(!chasse){
        return res.status(404).json({message:"Chasse not found"});
    }

    const teamData = await getTeamInChasseByNumber(idObject,team);
    if(!teamData.status){
        return res.status(404).json({message:"Team not found"});
    }

    //verification joueur pas déja inscrit

    const playerList = (await getTeamInChasseByNumber(idObject,team)).content.teamPlayersIds;
    console.log(playerList);
    console.log(team);
    if(playerList.includes(playerId)){
        return res.status(400).json({message:"This player is already in a team"});
    }
    playerList.push(playerId);
    const db = getDB();
    team=parseInt(team);

    const result = await db.collection('Chasses').updateOne(
        { _id: idObject, "playingTeams.teamId": team }, // Filtrer par ID et équipe
        { $set: { "playingTeams.$.teamPlayersIds": playerList } } // Met à jour la bonne équipe
    );


    if (result.modifiedCount === 0) {
        return res.status(500).json({ message: "Failed to add player to the team" });
    }
    console.log("player added");
    res.status(201).json({status:true, message: "Joueur ajoutée" });
}
exports.getTeamProgress = async (req, res) => {
    const {id,team} = req.params;
    const chasse = await getChasseById(id);
    const teamProgress=chasse.playingTeams[team-1].teamProgress;
    let completedSteps= 0;
    for(let i=0;i<teamProgress.length;i++){
        console.log(teamProgress[i]);
        if(teamProgress[i].reached){
            completedSteps++;
        }
    }

    return res.status(200).json({status:true, completedSteps:completedSteps});
}
exports.joinTeamByCode = async (req, res) => {
    console.log('Requête reçue pour rejoindre une équipe :', req.body);
    const { teamId, accessCode } = req.body;

    try {
        const db = getDB();
        const team = await db.collection('Teams').findOne({ _id: new ObjectId(teamId) });
        if (!team) {
            console.log('Équipe introuvable');
            return res.status(404).json({ message: "Équipe introuvable." });
        }

        if (team.accessCode !== accessCode) {
            console.log('Code d\'accès incorrect');
            return res.status(400).json({ message: "Code d'accès incorrect." });
        }

        console.log('Rejoint avec succès');
        res.status(200).json({ message: "Rejoint avec succès !", teamName: team.teamName });
    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({ message: "Erreur serveur. Veuillez réessayer plus tard." });
    }
};



exports.validateStepInProgress =async (req, res) => {
    try {
        const {id, team} = req.params;
        const numStep = req.body.step;
        let chasse = await getChasseById(id);
        const teamProgress = chasse.playingTeams[team - 1].teamProgress;
        teamProgress[numStep-1].reached = true;
        const dateHeure = new Date();
        teamProgress[numStep-1].timeReached=dateHeure.toISOString();
        chasse.playingTeams[team - 1].teamProgress = teamProgress;

        const DB = await getDB();
        const objectId = new ObjectId(id);
        const result = await DB.collection('Chasses').updateOne(
            {_id: objectId},
            {$set: chasse}
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({message: "Chasse not updated"});
        }
        return res.status(200).json({status: true, message: "Chasse updated successfully"});
    }catch (err){
        return res.status(500).json({message: "Function didn't ran successfully" });
    }
}
exports.addMapImg = async (req, res) => {
    try {
        // Si le fichier est uploadé avec succès
        if (req.file) {
            res.status(200).json({
                status: 'success',
                message: 'Image uploaded successfully!',
                file: req.file, // Retourne les informations du fichier
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'No file uploaded',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}
exports.getChasseMapImg = async (req,res)=>{
    console.log("chasse map img")
    const idChasse = req.params.id;

    const objectId = new ObjectId(idChasse);
    const db = getDB();
    const result =await db.collection('Chasses').findOne(
        { _id: objectId },
    );
    const fileName = result.mapFile;

    const pathFile = path.resolve(__dirname,'../../public/maps/'+fileName);
    console.log(pathFile);
    if(fs.existsSync(pathFile)) {

        // renvoit le fichier au client
        res.sendFile(pathFile)
    } else {
        // le fichier n'existe pas

        res.statusCode = 404;

        res.json({
            success: false,
            message: "Not found",
            path: pathFile
        })
    }
}