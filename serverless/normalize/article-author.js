var AWS = require("aws-sdk");
var fs = require('fs');
var s3 = new AWS.S3();
AWS.config.update({ region: "us-east-1" });

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://dictiozproduction-shard-00-00-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-01-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-02-v9lbp.mongodb.net:27017/netflix?ssl=true&replicaSet=DictiozProduction-shard-0&authSource=admin';
const dbName = 'dictioznews';

function connection(){
    MongoClient.connect(url,{
        auth: {
            user: 'netflix',
            password: 'netflix2017$'
        }
    }, function(err, client) {
    
        if(err){
            console.log("Error connection",err);
            connection();
            return;
        }
    
        console.log("Connected successfully to servers");
    
        const db = client.db(dbName);
        const articles = db.collection('note');
        const authors = db.collection('journalist');

        start(articles,authors);
    
        client.on('close', function (err) {
            console.log("Conexion error",err)
            connection();
        });
    });
}

connection();

function start(articles,authors){

    

    (async () =>{

        const author = await authors.findOne({$or:[{isAuthorFixed: false},{isAuthorFixed: {$exists: false}}]});
        if(!author || !author._id){
            console.log("Dont fined author");
            // start(articles,authors);
            return;
        }
        
        console.log("Author: ",author.name, "ID: ", author._id);

        const articleUpdate = await articles.update({authorName:author.name},{$set:{authorId:author._id}},{multi:true});
        if(!articleUpdate){
            console.log("Dont find articles: ",articleUpdate);
            start(articles,authors);
            return;
        }

        if(articleUpdate.result && articleUpdate.result.nModified && articleUpdate.result.nModified !== 0){
            console.log("Cantidad modificados: ", articleUpdate.result.nModified);
            let articleFixedUpdate = await articles.update({authorName:author.name},{$set:{isAuthorFixed:true}},{multi:true});
            console.log("Fiexed Authors true");
        }
        
        if(articleUpdate.result.nModified === 0){
            console.log("No Articles Modified: ",articleUpdate.result);
        }

        const authorUpdate = await authors.update({_id:author._id},{$set:{isAuthorFixed: true}},{multi: false});

        if(authorUpdate.result.nModified !== 1){
            console.log("Updating Author: ",authorUpdate.result.nModified);
        }
        
        start(articles,authors);

    })()
    .catch((err)=>{
        console.log(err);
    })
    

}