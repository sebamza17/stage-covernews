// const MongoClient = require('mongodb').MongoClient;
import MongoClient from 'mongodb'

const url = 'mongodb://dictiozproduction-shard-00-00-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-01-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-02-v9lbp.mongodb.net:27017/dictioznews?ssl=true&replicaSet=DictiozProduction-shard-0&authSource=admin';
const dbName = 'dictioznews';

let isConnected;

module.exports = connectToDatabase = () => {

    return new Promise((resolve,reject)=>{

        if (isConnected) {
            console.log('=> using existing database connection');
            return resolve(isConnected);
        }

        console.log('=> using new database connection');

        MongoClient.connect(url,{
            auth: {
                user: 'netflix',
                password: 'netflix2017$'
            }
            }, (err, client)=> {
                if(err){
                    console.log('Error connection to database',err);
                    reject(err);
                    return;
                }
                const db = client.db(dbName);
                isConnected = db;
                resolve(isConnected);
            });
    });

};