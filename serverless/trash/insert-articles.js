var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({ region: "us-east-1" });

var docClient = new AWS.DynamoDB.DocumentClient();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dictiozproduction-shard-00-00-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-01-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-02-v9lbp.mongodb.net:27017/netflix?ssl=true&replicaSet=DictiozProduction-shard-0&authSource=admin';
// Database Name
const dbName = 'netflix';

let i = 0;

MongoClient.connect(url,{
    auth: {
        user: 'netflix',
        password: 'netflix2017$'
    }
}, function(err, client) {
    
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const articles = db.collection('note');

    recursivity(articles);

    client.on('close', function () {
        console.log('Error...close');
      });
});

/**
 * Recursivity
 */
function recursivity(articles){

    console.log("Find new Articles");

    articles.find({$or:[{migrated: false},{migrated: {$exists: false}}]},{limit: 1000}).toArray(function(err,doc){

        if(err || !doc || doc.length <= 0){
            console.log("Doc is undefined",err);
            return;
        }

        console.log("Update Articles");
        updateArticleInMongo(0,doc,articles);

        console.log("Insert Articles");
        doc.forEach(function(item){
            insertArticle(item,function(){});
        });
        
    });
    
}

/**
 * Update Recursivity
 * @param {*} index 
 * @param {*} doc 
 * @param {*} articles 
 */
function updateArticleInMongo(index,doc,articles){

    if(index >= doc.length){
        recursivity(articles);
        return;
    }

    articles.updateOne({_id: doc[index]._id},{$set:{migrated:true}},{new: true},function(e,d){
        console.log("Mongo Update: Total ");
        updateArticleInMongo(++index,doc,articles)
    });
}

/**
 * Insert Article
 * @param {*} article 
 * @param {*} cb 
 */
function insertArticle(article,cb){

    let item = {};

    clean(article);
    clean(article.article);

    if(article._id)item.mongoId = article._id.toString();

    if(article.stats)item.stats = true;
    if(!article.stats)item.stats = false;

    if(article.isHome)item.isHome = true;
    if(!article.isHome)item.isHome = false;

    if(article.isInCover)item.isInCover = true;
    if(!article.isInCover)item.isInCover = false;

    if(article.isFacebookScraped)item.isFacebookScraped = true;
    if(!article.isFacebookScraped)item.isFacebookScraped = false;

    item.title = article.article.title || 'No Title';
    article.article.title = item.title;

    item.lowerTitle = item.title.toLowerCase() || 'No Title';
    
    item.article = article.article || {};

    item.canonical = article.canonical || 'no-canonical';
    
    item.scrapedAt = article.scrapedAt || '2018-01-01 00:00:00';
    
    item.newspaperIdMongo = article.newspaper || 'No Newspaper';
    item.url = article.url || 'No url';
    item.categoryIdMongo = (article.category)?article.category.toString() : 'No category';
    item.crawlerIdMongo = (article.crawlerId)?article.crawlerId.toString() : 'No Crawler id';
    item.createdAt = article.createdAt || '2018-01-01 00:00:00';
    
    item.authorName = article.article.author || 'No author name';

    item.authorNameLower = item.authorName.toLowerCase();

    item.watson = article.watson || 'No Watson';
    
    var params = {
        TableName: "Article",
        Item: item
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.log(article);
            console.log(JSON.stringify(err));
        } else {
            i++;
            console.log("PutItem succeeded:", item.lowerTitle, 'Number: ', i);
        }
    });
}

function clean(obj) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
  }