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

    if(!header.token || !header.Token){
        callback(null, failure("Token undefined"));
        return;
    }

    getConnection()
    .then((db)=>{

        (async () =>{
            const userCollection = db.collection('user');
            const user  = await userCollection.findOne({refreshToken: header.token});
            if(!user){
                callback(null, failure("User undefined"));
                return;
            }
            const authorsFollowCollection = db.collection('authorFollow');
            const authorsFollowing = await authorsFollowCollection.find(
                {user: user._id},
                {author: 1, user: 0,_id: 0},
                {limit: 20})
                .toArray();
            if(!authorsFollowing || authorsFollowing.length <=0){
                callback(null, success([]));
                return;
            }
            let authorsId = []
            authorsFollowing.forEach((item)=>{
                authorsId.push(item.author);
            });
            const authorsCollection = db.collection('journalist');
            const authors = await authorsCollection.find({_id:{$in:authorsId}},{limit: 20}).toArray();
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
 * Get 20 authors
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
            const user  = await userCollection.findOne({refreshToken: header.token});
            if(!user){
                callback(null, failure("User undefined"));
                return;
            }
            const authorsFollowCollection = db.collection('authorFollow');
            let authorId = mongodb.ObjectID(follow.author);
            const authorsFollowing = await authorsFollowCollection.update(
                {user: user._id,author: authorId},
                {$set:{user: user._id,author: authorId}},
                {upsert: true, new: true}
            );
            callback(null, success(authorsFollowing,header.token));
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