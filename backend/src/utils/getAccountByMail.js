const { getDB } = require('../config/db');


exports.getAccountByMail = async(mail)=> {
    try {
        const DB = await getDB();
        return await DB.collection('Accounts').findOne({mail: mail});
    } catch (err) {
        return null;
    }
}