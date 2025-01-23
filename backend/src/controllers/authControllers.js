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
    if (await isCorrect(mail, password)) {
        req.session.isLoggedIn = true;
        req.session.mail = mail;
        req.session.save((err) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde de la session :", err);
            } else {
                console.log("Session sauvegardée :", req.session);
                res.json({ message: 'Connexion réussie' });
            }
        });
    } else {
        console.log("Connexion échouée");
        res.status(401).json({ message: 'Mail ou mot de passe incorrect' })
    }
}

async function isCorrect(mail,password) {
    let data = await getAccountByMail(mail);
    return (data.password === password);
}

exports.getSession = async (req, res) => {
    console.log(req.session);
    if (req.session.isLoggedIn) {
        console.log("OMG ON EST CONNECTE C'EST UNE FOLIE");
        res.json({
            isLoggedIn: req.session.isLoggedIn,
            mail: req.session.mail
        });
    } else {
        console.log("PUTAIN SA GRAND MERE CA A FOIRE");
        res.status(401).json({ message: 'Utilisateur non connecté' });
    }
}