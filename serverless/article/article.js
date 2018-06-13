
import {success, failure} from '../libs/response-lib';
import {connectToDatabase} from '../libs/mongodb-connect';

/**
 * Get All
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function get (event, context, callback) {

    connectToDatabase()
    .then((db)=>{
        const articles = db.collection('note');
        articles.findOne({},(err,doc)=>{
            if(err){
                callback(null, failure(err));
                return;
            }
            callback(null, success(doc));
        })
    });
};