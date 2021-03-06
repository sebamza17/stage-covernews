import mongodb from 'mongodb';
import {success, failure} from './libs/response-lib';
import {getConnection} from './libs/mongodb-connect';
import AWS from 'aws-sdk';
import request from 'request';

const s3 = new AWS.S3();

let eachNoteByCategories = false;
let eachNoteByAuthor = false;

clearMemoryCache();

/**
 * Get last articles
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function get (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let queryString = parseQueryString(event);
    
    let limit = 5;
    let skip = 0;

    if(queryString.limit){
        limit = parseInt(queryString.limit);
    }
    
    if(queryString.skip){
        skip = parseInt(queryString.skip);
    }

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.find({},{limit: limit, skip: skip}).sort({createdAt: -1}).toArray((err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        })

    }).catch((err)=>{
        callback(null, failure(err));
    });

};

/**
 * Get one article
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function show (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.articleId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    let articleId = mongodb.ObjectID(event.pathParameters.articleId);

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.findOne({_id: articleId},(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        })
    }).catch((err)=>{
        callback(null, failure(err));
    });
};

/**
 * Get one article by URL canonical
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getByCanonical (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.canonical){
        callback(null, failure("Article Id undefined"));
        return;
    }

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.findOne({canonical: event.pathParameters.canonical},(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        })
    }).catch((err)=>{
        callback(null, failure(err));
    });
};

/**
 * Get Articles by category ID
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getByCategory(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.categoryId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    let categoryId = mongodb.ObjectID(event.pathParameters.categoryId);
    let queryString = parseQueryString(event);
    
    let limit = 5;
    let skip = 0;

    if(queryString.limit){
        limit = parseInt(queryString.limit);
    }

    if(queryString.skip){
        skip = parseInt(queryString.skip);
    }

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.find({category: categoryId},{limit: limit, skip: skip}).sort({createdAt: -1}).toArray((err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        })
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
 * Get Articles by author name
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getByAuthor(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.authorId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    let authorId = mongodb.ObjectID(event.pathParameters.authorId);
    let queryString = parseQueryString(event);
    
    let limit = 5;
    let skip = 0;

    if(queryString.limit){
        limit = parseInt(queryString.limit);
    }
    
    if(queryString.skip){
        skip = parseInt(queryString.skip);
    }

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        const author = db.collection('journalist');
        author.findOne({_id: authorId},(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }

            articles.find({authorName: doc.name},{limit: limit, skip: skip}).sort({createdAt: -1}).toArray((err,doc)=>{
                if(err){
                    callback(null, failure(err));
                    return;
                }
                callback(null, success(doc));
            })
        });
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
 * Search articles by text index
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function search(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.criteria){
        callback(null, failure("Criteria undefined"));
        return;
    }

    let criteria = decodeURI(event.pathParameters.criteria);

    let queryString = parseQueryString(event);
    
    let limit = 5;
    let skip = 0;

    if(queryString.limit){
        limit = parseInt(queryString.limit);
    }
    
    if(queryString.skip){
        skip = parseInt(queryString.skip);
    }

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        let query = {};
        query.$text = {
            $search: '"'+criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        articles.find(query,{limit: limit, skip: skip}).sort({createdAt: -1}).toArray((err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        });
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
 * Get Full Article from ID
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getFullArticle(event,context, callback){

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.articleId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    let articleId = mongodb.ObjectID(event.pathParameters.articleId);

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.findOne({_id: articleId},(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }

            // let params = {
            //     Bucket: 'dictioznewz',
            //     Key: 'articles/'+doc._id+'.json'
            // };

            let url = 'https://s3.amazonaws.com/dictioznewz/articles/'+doc._id+'.json';

            request.get(url,function(status,response,body){

                let resp = {};
                if(typeof body === 'string'){
                    try{
                        resp = JSON.parse(body).content;
                    }catch(e){
                        resp = body;
                    }
                    
                }else{
                    resp = body;
                }

                doc.content = resp;
                callback(null, success(doc));
            });
        
        })
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
 * Get only content from Id article
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getArticleContent(event,context, callback){

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.articleId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    let params = {
        Bucket: 'dictioznewz',
        Key: 'articles/'+event.pathParameters.articleId+'.json'
    };

    s3.getObject(params, function (err, data) {
        if (err){
            callback(null, failure(err));
            return;
        }

        let body = JSON.parse(data.Body.toString('utf-8'));

        callback(null, success(body));
    });
}

/**
 * Get articles for following authors
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getArticlesByFollowingAuthors(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    let header = parseHeader(event,callback);

    getConnection()
    .then((db)=>{
        (async () =>{
            const userCollection = db.collection('user');
            const user  = await userCollection.findOne({refreshToken: header.token});
            if(!user){
                callback(null, failure("User undefined"));
                return;
            }
            if(!user.authors || user.authors.length <=0){
                callback(null, success([]));
                return;
            }

            const articlesColl = db.collection('note');
            const articles = await articlesColl.aggregate([
                {$match: {"authorId":{$in: user.authors}}},
                {$sort: { createdAt: -1 }},
                {
                    $group: {
                        _id: "$authorId",
                        note: { $first: "$$ROOT" }
                    }
                },
                {$replaceRoot: { newRoot: "$note" }}
            ],{allowDiskUse: true}).toArray();
            callback(null, success(articles));
        })()
        .catch((err)=>{
            callback(null, failure(err));
        });
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
 * Get articles for following categories
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getArticlesByFollowingCategories(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    let header = parseHeader(event,callback);

    getConnection()
    .then((db)=>{
        (async () =>{
            const userCollection = db.collection('user');
            const user  = await userCollection.findOne({refreshToken: header.token});
            if(!user){
                callback(null, failure("User undefined"));
                return;
            }
            if(!user.categories || user.categories.length <=0){
                callback(null, success([]));
                return;
            }

            const articlesColl = db.collection('note');
            const articles = await articlesColl.aggregate([
                {$match: {"category":{$in: user.categories}}},
                {$sort: { createdAt: -1 }},
                {
                    $group: {
                        _id: "$category",
                        note: { $first: "$$ROOT" }
                    }
                },
                {$replaceRoot: { newRoot: "$note" }}
            ],{allowDiskUse: true}).toArray();
            callback(null, success(articles));
        })()
        .catch((err)=>{
            callback(null, failure(err));
        });
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
 * Get one articles from each categories
 * ToDo: esta operacion es muy costosa, agregar algún motor de BD en memoria (por ej redis)
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getArticlesByCategories(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    let header = parseHeader(event,callback);

    let queryString = parseQueryString(event);
    
    let limit = 8;
    let skip = 0;

    if(queryString.limit){
        limit = parseInt(queryString.limit);
    }
    
    if(queryString.skip){
        skip = parseInt(queryString.skip);
    }

    if(eachNoteByCategories){
        callback(null, success(eachNoteByCategories));
        return;
    }

    getConnection()
    .then((db)=>{
        (async () =>{
            //busco las categorias
            const categoryCollection = db.collection('category');
            const categoryList  = await categoryCollection.find({},{ projection:{name: 1} }).toArray();
            
            //genero un arrays de ids de categoria
            const categoryIds = categoryList.map(function(e) { 
                return e._id;
            });

            //busco una nota por categoria ordenadas por fecha de creacion de forma descendente
            const articlesColl = db.collection('note');
            const articles = await articlesColl.aggregate([
                { 
                    $match: { 
                        "category":{
                            $in: categoryIds 
                        }
                    }
                },
                {
                    $group: {
                        _id: "$category",
                        note: { $first: "$$ROOT"}
                    }
                },
                { $replaceRoot: { newRoot: "$note" } },
                { $project : { _id : 1 ,title : 1, image : 1, category:1, newspaperName: 1, authorName: 1, createdAt: 1} },
                { $sort: { createdAt: -1 }},
                { $skip: skip},
                { $limit : limit }
            ],{allowDiskUse: true}).toArray();

            eachNoteByCategories = articles.map(
                function(doc){
                    if(categoryList && categoryList.length > 0 && doc && doc.category){
                        doc.categoryName = categoryList.find( e => e._id.equals(doc.category)).name;
                    }else{
                        doc.categoryName = "Otras"
                    }
                    return doc;
                }
            );
            
            callback(null, success(eachNoteByCategories));
        })()
        .catch((err)=>{
            callback(null, failure(err));
        });
    }).catch((err)=>{
        callback(null, failure(err));
    });
}

/**
*Get one article from each author
* @param { array de ids de autores ej: {"authors" :  [ "id1", "id2"]}} event.body   
* @param {*} context 
* @param {*} callback 
*/
export function getArticlesByAuthor(event, context, callback) {

    if (!JSON.parse(event.body).authors) {
        callback(null, failure("authors array undefined"));
        return;
    }

    if(eachNoteByAuthor){
        callback(null, success(eachNoteByAuthor));
        return;
    }

    getConnection()
        .then((db) => {
            (async () => {
                
                //convierto los strigs en objIds de Mongo para buscar
                const authorsIds = JSON.parse(event.body).authors.map(e => {
                    return mongodb.ObjectId(e);
                });
                
                const articlesColl = db.collection('note');
                const articles = await articlesColl.aggregate([
                    {$match: { "authorId": { $in: authorsIds } }},
                    {$sort: {createdAt: -1}},
                    {
                       "$group": {
                           "_id": "$authorId",
                           "noteId": { "$last": "$_id" },
                           "image": { "$last": "$image" },
                           "title": { "$last": "$title" },
                           "createdAt": { "$last": "$createdAt" },
                           "authorName": {"$last": "$authorName"},
                           "newspaperName": {"$last": "$newspaperName"},
                       }
                    },
                    {$project: { _id: 0}} 
                ]).toArray();
                
                eachNoteByAuthor = articles;

                callback(null, success(articles));
            })()
                .catch((err) => {
                    callback(null, failure(err));
                });
        }).catch((err) => {
            callback(null, failure(err));
        });
}

// PRIVATE

function parseHeader(event,cb){
    let header = event.headers;

    if(typeof header == "string"){
        try{
            header = JSON.parse(header);
        }catch(e){
            cb(null, failure(e));
            return header;
        }
    }

    return header;
}

/**
 * Parse Body
 * @param {*} event 
 * @param {*} cb 
 */
function parseBody(event,cb){
    let body = event.body;

    if(typeof body == "string"){
        try{
            body = JSON.parse(body);
        }catch(e){
            cb(null, failure(e));
            return body;
        }
    }

    return body;
}

/**
 * Parse Body
 * @param {*} event 
 * @param {*} cb 
 */
function parseQueryString(event,cb){
    let query = event.queryStringParameters;

    if(!query){
        return {};
    }

    if(typeof query == "string"){
        try{
            query = JSON.parse(query);
        }catch(e){
            return {};
        }
    }

    return query;
}

/**
 * Clear Memory cache
 */
function clearMemoryCache(){
    setTimeout(()=>{
        eachNoteByAuthor = false;
        eachNoteByCategories = false;
    },180000);
}