import { success, failure } from './libs/response-lib';
import { getConnection } from './libs/mongodb-connect';
import { signIn,signUp, updateUserId } from './libs/cognito-helper';
import { suscribeUserMailchimp } from './libs/mailchimp-helper';
import { saveUserinDb } from './libs/mongodb-helper';

/**
 * Refresh the user token
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function refreshToken(event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let body = event.body;

    if (typeof body == "string") {
        try {
            body = JSON.parse(body);
        } catch (e) {
            callback(null, failure(e));
            return;
        }
    }

    if (!body.user) {
        callback(null, failure("User is udenfined"));
        return;
    }

    let userObj = body.user;
    userObj.refreshToken = body.refreshToken;

    getConnection()
        .then((db) => {
            const user = db.collection('user');
            user.update(
                { uid: userObj.uid },
                { $set: userObj },
                { upsert: true, new: true },
                (err, doc) => {
                    if (err) {
                        callback(null, failure(err));
                        return;
                    }
                    callback(null, success(doc));
                })
        }).catch((err) => {
            callback(null, failure(err));
        });
}


/**
 * Get user by Refresh Token
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getByToken(event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    let header = event.headers;

    if (typeof header == "string") {
        try {
            header = JSON.parse(header);
        } catch (e) {
            callback(null, failure(e));
            return;
        }
    }

    if (!header.token) {
        callback(null, failure("Token is udenfined"));
        return;
    }

    let token = header.token;

    getConnection()
        .then((db) => {
            const user = db.collection('user');
            user.findOne(
                { refreshToken: token },
                { uid: 1 },
                (err, doc) => {
                    if (err) {
                        callback(null, failure(err));
                        return;
                    }
                    callback(null, success(doc));
                });
        }).catch((err) => {
            callback(null, failure(err));
        });
}

/**
 * Recibe los datos de firebase y hace un signup (sino existe el user) y luego un sign in 
 * y devuelve los token para atorizar las llamadas a la API.
 * 
 * TODO: agregar un helper que valide el token de firebase
 * No usar callbackWaitsForEmptyEventLoop porque corta la ejecucion cuando hace el callback 
 * y detiene las operaciones (en mongo,mc, etc) que se procesan asincronamente
 * 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function cognitoAuthorizer(event, context, callback) {
    
    let body = event.body;

    //Parseo los parametros del body
    if (typeof body == "string") {
        try {
            body = JSON.parse(body);
        } catch (e) {
            callback(null, failure(e));
            return;
        }
    }

    //Intento loguear en cognito
    signIn(body.email, null, function (err, result){
        if(err){
            console.log(err);
            //Sino existe,creo un nuevo user en cognito
            signUp(body, function(err, resultUser){
                
                if (err)
                    callback(null, failure(err));
                else{
                    
                    //Guardo el user en Mongo
                    saveUserinDb(body, function(err, result){
                        if(err){
                            console.log("Error creating user in mongoDB: ", err);
                            callback(null, failure(err));
                        }else{
                            
                            //Guardo el user en mailchimp
                            suscribeUserMailchimp(body.email);

                            //Logueo en Cognito y devuelvo los tokens de acceso  
                            //Y aprobecho el signin para agregar como campo el id de mongo
                            signIn(body.email,result, function (err, result){
                                if(err)
                                    callback(null, failure(err));
                                else
                                    callback(null, success(result));
                            });
                        }
                    });
                }
            });
        }else{
            callback(null, success(result));
        }
    });
}