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

    getConnection()
    .then((db)=>{
        const authors = db.collection('journalist');
        authors.find({},{limit: 20}).toArray((err,doc)=>{
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
        
        authors.find(query,{limit: 20}).toArray((err,doc)=>{
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