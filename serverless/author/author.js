
import {success, failure} from '../libs/response-lib';
import {connectToDatabase} from '../libs/mongodb-connect';

/**
 * Get 20 authors
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
        const authors = db.collection('journalist');
        authors.find({},{limit: 20},(err,doc)=>{
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
 * Get one author
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function show (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.authorId){
        callback(null, failure("Author Id undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const author = db.collection('journalist');
        author.findOne({_id: event.pathParameters.authorId},(err,doc)=>{
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
 * Search author by text index
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
        const authors = db.collection('journalist');

        let query = {};
        query.$text = {
            $search: '"'+event.pathParameters.criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        authors.find(query,(err,doc)=>{
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