const {getDB} = require("../config/db");
const {ObjectId} = require("mongodb");
exports.funcGetUserById = async (id)=>{
    const DB = await getDB();
    const objectId = new ObjectId(id);
    const account = await DB.collection('Accounts').findOne({_id:objectId});

    if(!account){
        return ({status:false,error: 'Account not found'});
    }
    return({status:true,content:account});
}