
import {success, failure} from '../libs/response-lib';
import {connectToDatabase} from '../libs/mongodb-connect';

/**
 * Get last articles
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function get (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const articles = db.collection('note');
        articles.find({},{sort:{scrapedAt: -1},limit: 50},(err,doc)=>{
            if(err){
                console.log("Error getting",err);
                callback(null, failure(err));
                return;
            }
            console.log("Before Callback");
            callback(null, success(doc));
        })
    });
};

/**
 * Get one article
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function show (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.articleId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const articles = db.collection('note');
        articles.findOne({_id: event.pathParameters.articleId},(err,doc)=>{
            if(err){
                console.log("Error getting",err);
                callback(null, failure(err));
                return;
            }
            console.log("Before Callback");
            callback(null, success(doc));
        })
    });
};

/**
 * Get one article by URL canonical
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function getByCanonical (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.canonical){
        callback(null, failure("Article Id undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const articles = db.collection('note');
        articles.findOne({canonical: event.pathParameters.canonical},(err,doc)=>{
            if(err){
                console.log("Error getting",err);
                callback(null, failure(err));
                return;
            }
            console.log("Before Callback");
            callback(null, success(doc));
        })
    });
};

/**
 * Get Articles by category ID
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function getByCategory(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.categoryId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const articles = db.collection('note');
        articles.find({category: event.pathParameters.categoryId},(err,doc)=>{
            if(err){
                console.log("Error getting",err);
                callback(null, failure(err));
                return;
            }
            console.log("Before Callback");
            callback(null, success(doc));
        })
    });
}

/**
 * Get Articles by author name
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function getByAuthor(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.authorId){
        callback(null, failure("Article Id undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const articles = db.collection('note');
        const author = db.collection('journalist');
        author.findOne({_id: event.pathParameters.authorId},(err,doc)=>{
            if(err){
                console.log("Error getting",err);
                callback(null, failure(err));
                return;
            }

            articles.find({authorName: doc.name},(err,doc)=>{
                if(err){
                    console.log("Error getting",err);
                    callback(null, failure(err));
                    return;
                }
                console.log("Before Callback");
                callback(null, success(doc));
            })
        });
    });
}

/**
 * Search articles by text index
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function search(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.criteria){
        callback(null, failure("Criteria undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const articles = db.collection('note');

        let query = {};
        query.$text = {
            $search: '"'+event.pathParameters.criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        articles.find(query,(err,doc)=>{
            if(err){
                console.log("Error getting",err);
                callback(null, failure(err));
                return;
            }
            console.log("Before Callback");
            callback(null, success(doc));
        });
    });
}