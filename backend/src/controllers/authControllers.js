exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de déconnexion' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Déconnecté !' });
    });
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (email === 'test@test.com' && password === '1234') {
        req.session.user = { email };
        return res.json({ success: true, message: 'Connecté !' });
    }
    return res.status(401).json({ success: false, message: 'Identifiants invalides' });
}

exports.getSession = async (req, res) => {
    if (req.session.isLoggedIn) {
        res.json({
            isLoggedIn: req.session.isLoggedIn,
            mail: req.session.mail
        });
    } else {
        res.status(401).json({ message: 'Utilisateur non connecté' });
    }
}