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

    getConnection()
    .then((db)=>{

        (async () =>{
            const userCollection = db.collection('user');
            const user  = await userCollection.findOne({refreshToken: header.token});
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
            const authorsCollection = db.collection('authors');
            const authors = await authorsCollection.find({$in:authorsId},{limit: 20}).toArray();
            callback(null, success(authors));
        })()
        .catch((err)=>{
            callback(null, failure(err));
        });

    }).catch((err)=>{
        callback(null, failure(err));
    });
};

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