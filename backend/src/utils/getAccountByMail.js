const { getDB } = require('../config/db');


exports.getAccountByMail = async(mail)=> {
    try {
        const DB = await getDB();
        const account = await DB.collection('Accounts').findOne({mail: mail});
        return account;
    } catch (err) {
        return "Une erreur s'est produite";
    }
}