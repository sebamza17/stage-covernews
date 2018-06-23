import {success, failure} from './libs/response-lib';
import {getConnection} from './libs/mongodb-connect';

/**
 * Get one author
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function login (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let admin = event.body.admin;

    getConnection()
    .then((db)=>{
        const author = db.collection('admin');
        author.findOne(admin,(err,doc)=>{
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