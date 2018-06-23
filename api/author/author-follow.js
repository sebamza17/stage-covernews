import mongodb from 'mongodb';
import {success, failure} from '../libs/response-lib';
import {getConnection} from '../libs/mongodb-connect';

/**
 * Get 20 authors
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function get (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let header = parseHeader(event,callback);

    if(!header.token){
        callback(null, failure("Token undefined"));
        return;
    }

    getConnection()
    .then((db)=>{
        console.log("Before");
        (async () =>{
            console.log("Inside");
            const userCollection = db.collection('user');
            const user  = await userCollection.findOne({refreshToken: header.token});
            if(!user){
                callback(null, failure("User undefined"));
                return;
            }
            if(!user.authors || user.authors.length <=0){
                callback(null, success([]));
                return;
            }
            const authorsCollection = db.collection('journalist');
            const authors = await authorsCollection.find({_id:{$in:user.authors}},{limit: 20}).toArray();
            console.log("Callback");
            callback(null, success(authors));
        })()
        .catch((err)=>{
            callback(null, failure(err));
        });

    }).catch((err)=>{
        callback(null, failure(err));
    });
};

/**
 * follow authors
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function follow (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let header = parseHeader(event,callback);
    let body = parseBody(event,callback);

    let follow = body.follow;

    getConnection()
    .then((db)=>{

        (async () =>{
            const userCollection = db.collection('user');
            let authorId = mongodb.ObjectID(follow.author);
            const user  = await userCollection
                .update(
                    {refreshToken: header.token},
                    {$addToSet :{authors:authorId}}
                );
            
            callback(null, success(user,header.token));
        })()
        .catch((err)=>{
            callback(null, failure(err,header.token));
        });

    }).catch((err)=>{
        callback(null, failure(err,header.token));
    });
};


/**
 * Un Follow authors
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function unFollow (event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let header = parseHeader(event,callback);
    let body = parseBody(event,callback);

    let follow = body.follow;

    getConnection()
    .then((db)=>{

        (async () =>{
            const userCollection = db.collection('user');
            let authorId = mongodb.ObjectID(follow.author);
            const user  = await userCollection
                .update(
                    {refreshToken: header.token},
                    {$pull :{authors:authorId}}
                );
            
            callback(null, success(user,header.token));
        })()
        .catch((err)=>{
            callback(null, failure(err,header.token));
        });

    }).catch((err)=>{
        callback(null, failure(err,header.token));
    });
};


// PRIVATE

function parseHeader(event,cb){
    let header = event.headers;

    if(typeof header == "string"){
        try{
            header = JSON.parse(header);
        }catch(e){
            cb(null, failure(e));
            return header;
        }
    }

    return header;
}

/**
 * Parse Body
 * @param {*} event 
 * @param {*} cb 
 */
function parseBody(event,cb){
    let body = event.body;

    if(typeof body == "string"){
        try{
            body = JSON.parse(body);
        }catch(e){
            cb(null, failure(e));
            return body;
        }
    }

    return body;
}