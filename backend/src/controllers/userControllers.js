const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");



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
        console.log(id);
        const account = await DB.collection('Accounts').findOne({_id:objectId});

        if(!account){
            return res.status(404).json({error: 'Account not found'});
        }
        res.status(200).json(account);
    }catch(err) {
        res.status(500).json(err);
    }
};

exports.addAccount = async (req, res) => {
    try {
        console.log(req);
        const { name,password, mail } = req.body;
        console.log(req.body);
        if (!name ||!password|| !mail) {
            return res.status(400).json({ message: "Le nom et l'email sont requis" });
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
        console.log(result);
        res.status(201).json({ message: "Utilisateur créé" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur", error });
    }
}