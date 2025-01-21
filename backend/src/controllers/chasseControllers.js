const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");
const{validateChasseData}=require('../middleware/validateChasseData');
const {getChasseById} = require("../utils/getChasseById");
const {validateStepData} = require("../middleware/validateStepData");



/*
*
* Récupère toutes les chasses de la collection Chasses
*
* */
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
*
* Récupère la chasse possédant l'id id
*
* */

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


/**
 *
 * Récupère l'étape step de la chasse id
 *
 * */
exports.getChasseStep = async (req, res) => {
    const {id,step} = req.params;
    const chasse = await getChasseById(id);
    if(!chasse){
        return res.status(404).json({error: 'Chasse not found'});
    }
    const listSteps =chasse.steps;
    console.log(listSteps);
    if(listSteps.length < step){
        return res.status(404).json({error: "Step not found (too High)"});
    }
    if(!listSteps[parseInt(step)-1]){
        return res.status(404).json({error: "Step not found"});
    }

    return res.status(200).json(listSteps[parseInt(step)-1]);
}


/*
* Ajoute une chasse avec les infos de base
* */
exports.addChasse = async (req, res) => {
    try{
        const {accessCode,name,nbTeams,peopleByTeam,startDate,duration,themes,place,randomDeparture,randomSteps}= req.body;
        const validation = validateChasseData(req.body);

        if(validation.status === false){
            return res.status(400).json({status:false,message:validation.message});
        }

        const insertData = {
            "owner":new ObjectId("678e4ea36f8476e700635d7d"),
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
        const result = await db.collection('Chasses').insertOne(insertData);
        console.log("chasse added");
        res.status(201).json({status:true, message: "Chasse créée" });


    }catch(err) {
        res.status(500).json(err);
    }
}


/*
Ajoute une etape a une chasse
 */

exports.addStep = async (req, res) => {
    try {
        const {id} = req.params;
        const objectId = new ObjectId(id);
        const data = {
            chasseId: objectId,
            stepName: req.body.stepName,
            stepHint: req.body.stepHint,
            stepCode: req.body.stepCode
        };
        const validation = await validateStepData(data);
        if (validation.status === false) {
            //update de la chasse
        }

    }catch (err){
        res.status(500).json(err);
    }
}