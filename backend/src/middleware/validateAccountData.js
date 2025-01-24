const { getAccountByMail } = require('../utils/getAccountByMail');

exports.validateAccountData =async (data) => {
    const {name, password, mail} = data;
    if (!name || !password || !mail) {
        return ({status: false, message: "Le nom et l'email sont requis."});
    }

    if(name.length > 64) {
        return ({status:false,message:"Le nom peut faire maximum 64 caractères"});
    }

    if(mail.length > 128) {
        return ({status:false,message:"Le mail peut faire maximum 128 caractères"});
    }


    const mailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const mailFound = mail.match(mailRegEx);
    if (!mailFound || !mailFound.length) {
        return ({status: false, message: "L'email n'est pas au bon format."});
    }

    const accountsWithSameMail = await getAccountByMail(mail);
    if (accountsWithSameMail!=null) {
        return ({status: false, message: "Cet Email est déjà utilisé."});
    }


    return ({status:true,message:"Les données sont valides"});
};