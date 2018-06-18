import mongodb from 'mongodb';
import {success, failure} from '../libs/response-lib';
import {getConnection} from '../libs/mongodb-connect';

/**
 * Get 20 authors
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function update (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.authorId){
        callback(null, failure("Author Id undefined"));
        return;
    }

    let authorId = mongodb.ObjectID(event.pathParameters.authorId);
    let authorObj = event.body.author;

    if(authorObj._id){
        delete authorObj._id;
    }

    getConnection()
    .then((db)=>{
        const authors = db.collection('journalist');

        let query = {_id: authorId};
        let update = {$set: authorObj};
        let options = {new: true, upsert: true };

        authors.findAndModify(query,null,update, options,(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        });
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
export function remove (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.authorId){
        callback(null, failure("Author Id undefined"));
        return;
    }

    let authorId = mongodb.ObjectID(event.pathParameters.authorId);

    getConnection()
    .then((db)=>{
        const author = db.collection('journalist');
        author.remove({_id: authorId},{justOne: true},(err,doc)=>{
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
export function add(event,context,callback){
    context.callbackWaitsForEmptyEventLoop = false;

    let authorObj = event.body.author;

    getConnection()
    .then((db)=>{
        
        const authors = db.collection('journalist');
        authors.insert(authorObj,(err,doc)=>{
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