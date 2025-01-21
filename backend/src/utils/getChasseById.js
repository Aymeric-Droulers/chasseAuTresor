const { getDB } = require('../config/db');
const {ObjectId} = require("mongodb");

exports.getChasseById = async (id)=>{
    const DB = await getDB();
    const objectId = new ObjectId(id);
    const chasse = await DB.collection('Chasses').findOne({_id:objectId});

    if(!chasse){
        return null;
    }else{
        return chasse;
    }
}
