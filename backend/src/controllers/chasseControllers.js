const { getDB } = require('../config/db');

exports.getAllChasses = async (req, res) => {

    try {
        const DB = await getDB();
        const chasses = await DB.collection('Chasses').find().toArray();
        res.status(200).json(chasses);
    }catch(err) {
        res.status(500).json(err);
    }
};