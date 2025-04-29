const {MongoClient} = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

const connectToMongo = async () => {
    try{
        await client.connect();
        db = client.db('OrderService');
        console.log('Connected to MongoDB');
        return db;
    }catch(err){
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = {connectToMongo, client};