
import {success, failure} from '../libs/response-lib';
import {connectToDatabase} from '../libs/mongodb-connect';

/**
 * Get 20 category
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
        const category = db.collection('category');
        category.find({},{limit: 20},(err,doc)=>{
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
 * Get one category
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function show (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    if(!event.pathParameters.categoryId){
        callback(null, failure("category Id undefined"));
        return;
    }

    console.log("Start","Before connected")

    connectToDatabase()
    .then((db)=>{
        console.log("Start 2","Connected, before collection");
        const category = db.collection('category');
        category.findOne({_id: event.pathParameters.categoryId},(err,doc)=>{
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
 * Search category by text index
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
        const category = db.collection('category');

        let query = {};
        query.$text = {
            $search: '"'+event.pathParameters.criteria+'"',
            $language: 'spanish',
            $diacriticSensitive: false,
            $caseSensitive: false
        };
        
        category.find(query,(err,doc)=>{
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