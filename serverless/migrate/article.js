var AWS = require("aws-sdk");
var fs = require('fs');
var s3 = new AWS.S3();
AWS.config.update({ region: "us-east-1" });

const MongoClient = require('mongodb').MongoClient;


const url = 'mongodb://dictiozproduction-shard-00-00-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-01-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-02-v9lbp.mongodb.net:27017/netflix?ssl=true&replicaSet=DictiozProduction-shard-0&authSource=admin';
const dbNameNetflix = 'netflix';
const dbNameNews = 'dictioznews';


//GENERAL FLAGS
let init = false;
let amount = 0;
let total = 0;
let limit = 10;

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
    
        const dbNetflix = client.db(dbNameNetflix);
        const dbNews = client.db(dbNameNews);
    
        const articlesNet = dbNetflix.collection('note');
        const articlesNews = dbNews.collection('note');
    
        start(articlesNet,articlesNews);
    
        client.on('close', function (err) {
            console.log("Conexion error",err)
            connection();
        });
    });
}

connection();

/**
 * Start migrate
 * @param {*} dbNetflix 
 * @param {*} dbNews 
 */
function start(articlesNet,articlesNews){

    console.log("Find Next ",limit);

    articlesNet.find({$or:[{isMigrated: false},{isMigrated: {$exists: false}}]},{limit: limit}).toArray(function(err,doc){

        if(err || !doc || doc.length <= 0){
            console.log("Doc is undefined",err);
            return;
        }

        doc.forEach(function(art){
            let article = new Article(art);
            article.migrate(articlesNet,articlesNews);
        });

    });
}

/**
 * Article class
 */
class Article{

    constructor(articleObj){

        this.handlers = {
            netflix: null,
            news: null
        };
        
        this.articleObject = {};

        clean(articleObj);
        clean(articleObj.article);

        if(!articleObj.article){
            articleObj.article = {};
        }

        if(!articleObj.article.tags || articleObj.article.tags.length <= 0){
            articleObj.article.tags = [];
        }

        if(!articleObj.article.keywords || articleObj.article.keywords.length <= 0){
            articleObj.article.keywords = [];
        }

        if(typeof articleObj.article.keywords === 'string'){
            articleObj.article.keywords = articleObj.article.keywords.split(',');
            if(!articleObj.article.keywords){
                articleObj.article.keywords = [];
            }
        }

        let keywords =  articleObj.article.keywords.concat(articleObj.article.tags);

        keywords = [...new Set(keywords)];

        this.articleObject._id = articleObj._id;
        this.articleObject.isHome = (articleObj.isHome)?articleObj.isHome:false;
        this.articleObject.stats = (articleObj.stats)?articleObj.stats:false;
        this.articleObject.isInCover = (articleObj.isInCover)?articleObj.isInCover:false;
        this.articleObject.isFacebookScraped = (articleObj.isFacebookScraped)?articleObj.isFacebookScraped:false;
        this.articleObject.canonical = articleObj.canonical;
        this.articleObject.newspaper = articleObj.newspaper;
        this.articleObject.originalUrl = articleObj.url;
        this.articleObject.image = (articleObj.article.image)?articleObj.article.image:'https://dictioznewz.s3-accelerate.amazonaws.com/apple-icon.png';
        this.articleObject.articleDate = (articleObj.article.date)?articleObj.article.date: new Date();
        this.articleObject.keywords = (keywords)?keywords: [];
        this.articleObject.authorName = (articleObj.article.author)?articleObj.article.author: 'Sin Autor';
        this.articleObject.title = (articleObj.article.title)?articleObj.article.title: 'Sin titulo';;
        this.articleObject.category = articleObj.category || '5b202ef5d03337b3a0227daf'; //Other category
        this.articleObject.createdAt = articleObj.createdAt || new Date();
        this.articleObject.scrapedAt = articleObj.scrapedAt || new Date();
        this.articleObject.crawlerId = articleObj.crawlerId || null;
        this.articleObject.watson = articleObj.watson || {};

        this.body = {
            content: articleObj.article.content
        };
    }

    migrate(handlerNet,handlerNews){
        this.handlers.netflix = handlerNet;
        this.handlers.news = handlerNews;
        this.save(handlerNews);
    }

    /**
     * Save article on new database
     * @param {*} handler 
     */
    save(handler){
        handler.insert(this.articleObject,(err,doc)=>{
            if(err){
                console.log("Error insert new",err);
                return;
            }
            console.log("Insert",this.articleObject.title);
            this.createBodyFile();
        });
    }

    /**
     * Update old article with flag
     * @param {*} handler 
     */
    updateOld(handler){
        let articleId = this.articleObject._id;
        handler.update({_id: articleId},{$set:{isMigrated:true}},{new: true},(err,doc)=>{
            if(err){
                console.log("Error Update old",err);
                return;
            }
            total++;
            amount++;
            if(amount >= limit){
                amount = 0;
                start(this.handlers.netflix,this.handlers.news);
            }
        });
    }

    /**
     * Create Body File
     */
    createBodyFile(){
        let articleId = this.articleObject._id.toString();
        fs.writeFile(articleId+'.json',JSON.stringify(this.body),'utf8',(err)=>{
            if(err){
                console.log("Error Creating file",err);
                return;
            }
            this.uploadBodyFile();
        })
    }

    /**
     * Upload Body FIle
     */
    uploadBodyFile(){
        let articleId = this.articleObject._id.toString();

        fs.readFile(articleId+'.json', (err, data)=>{
            if (err) { 
                console.log("Error reading file",err); 
                return; 
            }
            var base64data = new Buffer(data, 'binary');
            s3.putObject({
              Bucket: 'dictioznewz',
              Key: 'articles/'+articleId+'.json',
              Body: base64data,
              'ContentType':'application/json',
              ACL: 'public-read'
            }, (resp) =>{
                if(resp){
                    console.log("Error uploading file",resp)
                    return;
                }
                console.log("Upload file: ",this.articleObject.title);
                this.removeBodyFile();
                this.updateOld(this.handlers.netflix);
            });
          });
    }

    /**
     * Remove Body File
     */
    removeBodyFile(){
        let articleId = this.articleObject._id.toString();
        fs.unlink(articleId+'.json',function(err){
            if(err){
                console.log("Error deleting file",err)
                return;
            }
       });  
    }
};

/**
 * Clean objets.
 * @param {*} obj 
 */
function clean(obj) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
  }

// /**
//  * Crate Signature
//  * @param req
//  * @param res
//  */
// function createSignature(article){

//     var s3Policy = {
//         'expiration': _getExpiryTime(),
//         'conditions': [
//             ['eq', '$key', 'articles/'+article._id+'.json'],
//             {'bucket': s3Config.bucket},
//             {'acl': s3Config.acl},
//             ['starts-with', '$Content-Type', req.body.type || 'application/octet-stream'],
//             ['starts-with', '$filename', ''],
//             ['content-length-range', 0, 50 * 1024 * 1024]
//         ]
//     };

//     var stringPolicy = JSON.stringify(s3Policy);
//     var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

//     // sign the base64 encoded policy
//     var signature = params.crypto.createHmac('sha1', s3Config.secret_key)
//         .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

//     params.Rest.response.http(req,res,null,{
//         acl: s3Config.acl,
//         bucket: s3Config.bucket,
//         policy: base64Policy,
//         signature: signature,
//         AWSAccessKeyId: s3Config.access_key_id
//     });
// }

// /**
//  * Get expiration time
//  * @returns {string}
//  * @private
//  */
// function _getExpiryTime () {
//     var _date = new Date();
//     return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
//         (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
// }