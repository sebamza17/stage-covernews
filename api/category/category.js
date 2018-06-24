import mongodb from 'mongodb';
import {success, failure} from './libs/response-lib';
import {getConnection} from './libs/mongodb-connect';

/**
 * Get 20 category
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
        const category = db.collection('category');
        category.find({},{limit: limit, skip: skip}).toArray((err,doc)=>{
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
 * Get one category
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function show (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.categoryId){
        callback(null, failure("category Id undefined"));
        return;
    }

    let categoryId = mongodb.ObjectID(event.pathParameters.categoryId);

    getConnection()
    .then((db)=>{
        
        const category = db.collection('category');
        category.findOne({_id: categoryId},(err,doc)=>{
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
 * Search category by text index
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
        
        const category = db.collection('category');
        let query = {};
        query.$text = {
            $search: '"'+criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        category.find(query,{limit: limit, skip: skip}).toArray((err,doc)=>{
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