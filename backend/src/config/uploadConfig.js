const multer = require('multer');
const path = require('path');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/maps'); // Répertoire où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        // Nom unique pour éviter les conflits
        const id = req.params.id;
        const extension = path.extname(file.originalname); // Récupérer l'extension du fichier
        const newName = `${id}${extension}`;
        cb(null, newName);
    }
});

// Filtrer les fichiers pour accepter seulement les images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accepte le fichier
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
