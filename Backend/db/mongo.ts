import mongoose from 'mongoose';

class DBClient{
    client: any;
    isConnected = false;
    db = null;
    constructor(){
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/BloggyPedia';
        mongoose.connect(uri).then(() => {
            this.isConnected = true;
            this.db = this.client.db('BloggyPedia');
          })
          .catch(() => {
            this.isConnected = false;
          });
    }

    public isDatabaseConnected(): boolean {
        return this.isConnected;
    }

    // Example method to get the database connection
    public getDbConnection(): mongoose.Connection | null {
        return this.db;
    }
}
const dbClient = new DBClient();

export default mongoose;