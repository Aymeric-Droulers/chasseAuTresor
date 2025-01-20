
const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb+srv://droulersaymeric:PggG7SVpJE4b6rCW@chasseautresor.c6ifr.mongodb.net/?retryWrites=true&w=majority&appName=ChasseAuTresor";



let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        console.log("Connected!");
        db = client.db("ChasseAuTresor");
    }catch(err) {
        console.error("Erreur de connexion MongoDB:", err);
        process.exit(1);
    }
}



const getDB = () => {
    if (!db) {
        throw new Error("La base de données n'est pas connectée!");
    }
    return db;
};

module.exports = { connectDB, getDB };

