var AWS = require("aws-sdk");
var fs = require('fs');
var s3 = new AWS.S3();
AWS.config.update({ region: "us-east-1" });

const MongoClient = require('mongodb').MongoClient;
const awsES = {};
awsES.region = 'us-east-1'; // e.g. us-west-1
awsES.domain = 'search-dictioz-crimcecy3hmsk6uy3mwc7zshie.us-east-1.es.amazonaws.com'; // e.g. search-domain.region.es.amazonaws.com
awsES.index = 'notes';
awsES.type = 'note';
awsES.id = 1;


const url = 'mongodb://dictiozproduction-shard-00-00-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-01-v9lbp.mongodb.net:27017,dictiozproduction-shard-00-02-v9lbp.mongodb.net:27017/netflix?ssl=true&replicaSet=DictiozProduction-shard-0&authSource=admin';
const dbNameNetflix = 'netflix';


//GENERAL FLAGS
let init = false;
let amount = 0;
let total = 0;
let limit = 1;

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
    
        const articlesNet = dbNetflix.collection('note');
        const articlesES = {};
        
        articlesES.endpoint = new AWS.Endpoint(awsES.domain);
        articlesES.request = new AWS.HttpRequest(articlesES.endpoint, awsES.region);
        articlesES.request.method = 'PUT';
        articlesES.request.path += awsES.index + '/' + awsES.type + '/' + awsES.id++;
        articlesES.request.headers['host'] = awsES.domain;
        articlesES.request.headers['Content-Type'] = 'application/json';   
        
        start(articlesNet,articlesES);
    
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
function start(articlesNet,articlesES){

    console.log("Find Next ",limit);

    articlesNet.find({$or:[{isInElastic: false},{isInElastic: {$exists: false}}]},{limit: limit}).toArray(function(err,doc){
        if(err || !doc || doc.length <= 0){
            console.log("Doc is undefined",err);
            return;
        }
        doc.forEach(function(art){
            let article = new Article(art);
            article.migrate(articlesNet,articlesES);
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
            es: null
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
        this.articleObject.title = (articleObj.article.title)?articleObj.article.title: 'Sin titulo';
        this.articleObject.category = articleObj.category || '5b202ef5d03337b3a0227daf'; //Other category
        this.articleObject.createdAt = articleObj.createdAt || new Date();
        this.articleObject.scrapedAt = articleObj.scrapedAt || new Date();
        this.articleObject.crawlerId = articleObj.crawlerId || null;
        this.articleObject.watson = articleObj.watson || {};

        this.body = {
            content: articleObj.article.content
        };
    }

    migrate(handlerNet,handlerES){
        this.handlers.netflix = handlerNet;
        this.handlers.es = handlerES;
        this.indexDocument(handlerES);
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
        handler.update({_id: articleId},{$set:{isInElastic:true}},{new: true},(err,doc)=>{
            if(err){
                console.log("Error Update old",err);
                return;
            }
            total++;
            amount++;
            if(amount >= limit){
                amount = 0;
                start(this.handlers.netflix,this.handlers.es);
            }
        });
    }

    indexDocument(handler) {
 
        //console.log(handler);
        handler.request.body = JSON.stringify(this.articleObject);
        
      
        var credentials = new AWS.EnvironmentCredentials('AWS');
        console.log(credentials);
        var signer = new AWS.Signers.V4(handler.request, 'es');
        signer.addAuthorization(credentials, new Date());
        console.log(signer);

        var client = new AWS.HttpClient();
        client.handleRequest(handler.request, null, function(response) {
          console.log("ES - response: ",response.statusCode + ' ' + response.statusMessage);
          console.log(response.contnet);

          //this.updateOld(this.handlers.netflix);

        //   var responseBody = '';
        //   response.on('data', function (chunk) {
        //     responseBody += chunk;
        //   });
        //   response.on('end', function (chunk) {
        //     callback(null, 'Response body: ' + responseBody);
        //   });
        }, function(error) {
          console.log(error, 'Error: ' + error);
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