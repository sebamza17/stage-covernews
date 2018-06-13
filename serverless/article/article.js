
import {success, failure} from '../libs/response-lib';
import {connectToDatabase} from '../libs/mongodb-connect';

/**
 * Get All
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
        articles.findOne({},(err,doc)=>{
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
