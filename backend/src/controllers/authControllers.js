const {getAccountByMail} = require("../utils/getAccountByMail");

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de déconnexion' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Déconnecté !' });
    });
}



exports.login = async (req, res) => {
    let mail=req.body.email;
    let password=req.body.password;
    // Authenticate user
    let account = await getAccount(mail,password);
    if (account) {
        req.session.isLoggedIn = true;
        req.session.mail = mail;
        req.session.user_id=account._id;
        req.session.save((err) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde de la session :", err);
            } else {
                res.json({ message: 'Connexion réussie' });
            }
        });
    } else {
        res.status(401).json({ message: 'Mail ou mot de passe incorrect' })
    }
}


async function getAccount(mail,password) {
    let data = await getAccountByMail(mail);
    if(data !==null && data.password === password){
        return data;
    }
    return null;
}

exports.getSession = async (req, res) => {
    console.log(req.session);
    if (req.session.isLoggedIn) {
        res.json({
            isLoggedIn: req.session.isLoggedIn,
            mail: req.session.mail,
            user_id: req.session.user_id,
        });
    } else {
        res.status(401).json({ message: 'Utilisateur non connecté' });
    }
}