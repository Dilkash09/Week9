const { MongoClient, ObjectId } = require('mongodb');

class Database {
    constructor() {
        this.uri = 'mongodb://localhost:27017';
        this.dbName = 'mydb';
        this.client = new MongoClient(this.uri);
        this.db = null;
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
            this.db = this.client.db(this.dbName);
            
            // Drop products collection to prevent duplication
            try {
                await this.db.collection('products').drop();
                console.log('Dropped products collection');
            } catch (err) {
                console.log('Products collection did not exist, creating new one');
            }
            
            // Create products collection
            await this.db.createCollection('products');
            console.log('Created products collection');
            
            return this.db;
        } catch (err) {
            console.error('Database connection error:', err);
            throw err;
        }
    }

    getObjectId(id) {
        try {
            return new ObjectId(id);
        } catch (err) {
            throw new Error('Invalid ObjectId format');
        }
    }

    async close() {
        await this.client.close();
    }
}

module.exports = new Database();