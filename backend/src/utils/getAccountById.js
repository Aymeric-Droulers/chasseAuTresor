const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");


exports.getAccountById = async(id)=> {
    try {
        id= new ObjectId(id);
        const DB = await getDB();
        return await DB.collection('Accounts').findOne({_id: id});
    } catch (err) {
        return "Une erreur s'est produite";
    }
}