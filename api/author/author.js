import mongodb from 'mongodb';
import {success, failure} from './libs/response-lib';
import {getConnection} from './libs/mongodb-connect';

/**
 * Get 20 authors
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
        const authors = db.collection('journalist');
        authors.find({
            $avatar: {
                $exists: true
            }
        },{limit: limit, skip: skip}).toArray((err,doc)=>{
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
 * Get one author
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function show (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.authorId){
        callback(null, failure("Author Id undefined"));
        return;
    }

    let authorId = mongodb.ObjectID(event.pathParameters.authorId);

    getConnection()
    .then((db)=>{
        const author = db.collection('journalist');
        author.findOne({_id: authorId},(err,doc)=>{
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
 * Search author by text index
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
        
        const authors = db.collection('journalist');

        let query = {};
        query.$text = {
            $search: '"'+criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        authors.find(query,{limit: limit, skip: skip}).toArray((err,doc)=>{
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
 * Search author by category
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function searchByCategory(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.categoryId){
        callback(null, failure("Category undefined"));
        return;
    }

    let category = decodeURI(event.pathParameters.categoryId);
    let queryString = parseQueryString(event);
    let limit = 15;
    let skip = 0;

    if(queryString.limit){
        limit = parseInt(queryString.limit);
    }
    
    if(queryString.skip){
        skip = parseInt(queryString.skip);
    }

    getConnection()
    .then((db)=>{
        const authors = db.collection('journalist');
        authors.find({ 'categories.categoryId': category },{limit: limit, skip: skip}).project({ name: 1, __v: 1, _id: 0 }).toArray((err,doc) =>{
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