const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");
const {validateAccountData}=require("../middleware/validateAccountData");
const {getUserById, funcGetUserById} = require("../middleware/funcGetUserById");


exports.getAllUsers = async (req, res) => {
    try {
        const DB = await getDB();
        const users = await DB.collection('Accounts').find().toArray();
        res.status(200).json(users);
    }catch(err) {
        res.status(500).json(err);
    }

};


exports.getUserById = async (req, res) => {
    try {
        const{id}=req.params;
        const response =await funcGetUserById(id);
        if(!response){
            res.status(404).json({error: 'No user with ID'});
        }
        res.status(200).json((response).content);
    }catch(err) {
        res.status(500).json(err);
    }
};



exports.getUserByMail = async (req, res) => {
    console.log("getmail");
    try {
        const DB = await getDB();
        const {mail} = req.params;
        console.log(req);
        const account = await DB.collection('Accounts').findOne({mail:mail});
        if(!account){
            return res.status(404).json({error: 'Account not found'});
        }
        res.status(200).json(account);
    }catch(err) {
        res.status(500).json(err);
    }
}



exports.addAccount = async (req, res) => {
    try {
        const { name,password, mail } = req.body;
        const validation = await validateAccountData(req.body);
        if(!validation.status){
            return res.status(400).json({status:false,message:validation.message});
        }

        const insertData ={
            "name": name,
            "password":password,
            "mail":mail,
            "chassesParticipated":[],
            "chassesCreated":[]
        }
        const db = getDB();
        const result = await db.collection('Accounts').insertOne(insertData);
        console.log("added");
        res.status(201).json({status:true, message: "Utilisateur créé" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur", error });
    }
}


exports.getUserChassesParticipated = async (req, res) => {
    try{
        const id=req.params.id;
        const user = await funcGetUserById(id);
        const listesChasses = user.content.chassesParticipated;
        return res.status(200).json(listesChasses);
    }catch(err) {
        return res.status(500).json(err);
    }
}


exports.getUserChassesCreated = async (req, res) => {
    try{
        const id=req.params.id;
        const user = await funcGetUserById(id);
        if(user) {

            const listesChasses = user.content.chassesCreated;
            return res.status(200).json(listesChasses);
        }
        res.status(404).json({error: 'User not found'});
    }catch(err) {
        return res.status(500).json(err);
    }
}

exports.addChasseParticipated = async (req, res) => {
    let id=req.params.id;
    let chasseId=req.body.id;

    id= new ObjectId(id);


    let account = await funcGetUserById(id);
    account = account.content;
    if(!account){
        res.status(404).json({error: 'Account not found'});
    }
    let chassesParticipated =account.chassesParticipated;
    if(chassesParticipated.includes(chasseId)){
        return res.status(400).json({error: 'Chasse already in list'});
    }
    chassesParticipated.push(chasseId);
    account.chassesParticipated=chassesParticipated;

    //requette de mise à jour:
    const db = getDB();
    const result = await db.collection('Accounts').updateOne(
        {_id: id},
        {$set:{"chassesParticipated":chassesParticipated}},
    )
    if (result.modifiedCount === 0) {
        return res.status(500).json({ message: "Failed to add chasse to the player" });
    }
    res.status(201).json({status:true, message: "Chasse Added" });

}


exports.addChasseCreated = async (req, res) => {
    let id=req.params.id;
    let chasseId=req.body.id;

    id= new ObjectId(id);


    let account = await funcGetUserById(id);
    account = account.content;
    if(!account){
        res.status(404).json({error: 'Account not found'});
    }
    let chassesCreated =account.chassesCreated;
    if(chassesCreated.includes(chasseId)){
        return res.status(400).json({error: 'Chasse already in list'});
    }
    chassesCreated.push(chasseId);
    account.chassesCreated=chassesCreated;

    //requette de mise à jour:
    const db = getDB();
    const result = await db.collection('Accounts').updateOne(
        {_id: id},
        {$set:{"chassesCreated":chassesCreated}},
    )
    if (result.modifiedCount === 0) {
        return res.status(500).json({ message: "Failed to add chasse to the player" });
    }
    res.status(201).json({status:true, message: "Chasse Added" });

}