import mongodb from 'mongodb';
import {success, failure} from '../libs/response-lib';
import {getConnection} from '../libs/mongodb-connect';

/**
 * Get last articles
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function get (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.find({},{limit: 50}).toArray((err,doc)=>{
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

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        articles.find({category: categoryId},{limit: 20}).toArray((err,doc)=>{
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

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        const author = db.collection('journalist');
        author.findOne({_id: authorId},(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }

            articles.find({authorName: doc.name},{limit: 20}).toArray((err,doc)=>{
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

    getConnection()
    .then((db)=>{
        const articles = db.collection('note');
        let query = {};
        query.$text = {
            $search: '"'+event.pathParameters.criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        articles.find(query,{limit: 20}).toArray((err,doc)=>{
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