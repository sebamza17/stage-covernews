import MongoClient from 'mongodb'

const url = 'mongodb://dictioztest-shard-00-00-v9lbp.mongodb.net:27017,dictioztest-shard-00-01-v9lbp.mongodb.net:27017,dictioztest-shard-00-02-v9lbp.mongodb.net:27017/dictioznews?ssl=true&replicaSet=dictiozTest-shard-0&authSource=admin';
const dbName = 'dictioznews';
let isConnected;

/**
 * Connect to Database
 */
export const connectToDatabase = async () => {

    console.log('=> using new database connection');
    return await MongoClient.connect(url,{
        auth: {
            user: 'netflix',
            password: 'netflix2017$'
        }
    })
    .then((client)=>{
        const db = client.db(dbName);
        isConnected = db;
        return db;
    });
};

/**
 * Get Connection
 */
export const  getConnection = async () => {

    if (isConnected) {
        console.log('=> using existing database connection');
        return await isConnected;
    }

    const connection =  await connectToDatabase();  
    return connection;
}