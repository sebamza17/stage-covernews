import { getConnection } from './mongodb-connect';

export function saveUserinDb(body, callback){
    getConnection()
    .then((db) => {
        const user = db.collection('user');
        user.insertOne({  
            "uid" : body.uid, 
            "__v" : 0, 
            "displayName" : body.displayName, 
            "email" : body.email, 
            "emailVerified" : body.emailVerified, 
            "phoneNumber" : body.phoneNumber, 
            "photoURL" : body.photoUrl,
        }).then(result => {
            console.log("User inserted en mongo DB: "+result.insertedId);
            callback(null, result.insertedId);
          })
          .catch(err => {
            console.log(err);
            callback(err, null);
          });
    }).catch((err) => {
        console.log(err);
        callback(err, null);
    });    
}
