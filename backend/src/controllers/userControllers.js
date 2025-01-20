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