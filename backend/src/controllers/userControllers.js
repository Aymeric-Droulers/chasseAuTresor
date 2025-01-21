const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");
const {validateAccountData}=require("../middleware/validateAccountData");


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
        const DB = await getDB();
        const {id} = req.params;
        const objectId = new ObjectId(id);
        const account = await DB.collection('Accounts').findOne({_id:objectId});

        if(!account){
            return res.status(404).json({error: 'Account not found'});
        }
        res.status(200).json(account);
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
