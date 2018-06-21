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
            const authorsCollection = db.collection('authorFollow');
            const authors = await authorsCollection.find(
                {user: user._id},
                {limit: 20})
                .toArray();
                
            callback(null, success(authors));
        })()
        .catch((err)=>{
            callback(null, failure(err));
        });

    }).catch((err)=>{
        callback(null, failure(err));
    });
};

async function getUserByToken(user,token){
    
    console.log(doc);
}


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