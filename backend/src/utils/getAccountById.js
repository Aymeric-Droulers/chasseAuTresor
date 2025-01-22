const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");


exports.getAccountById = async(id)=> {
    try {
        id= new ObjectId(id);
        const DB = await getDB();
        const account = await DB.collection('Accounts').findOne({_id: id});
        return account;
    } catch (err) {
        return "Une erreur s'est produite";
    }
}