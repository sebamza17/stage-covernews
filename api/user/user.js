import { success, failure } from './libs/response-lib';
import { getConnection } from './libs/mongodb-connect';
import { AWSCognito } from 'aws-sdk';

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
};


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
                })
        }).catch((err) => {
            callback(null, failure(err));
        });
};


/**
 * Get username from IdToken Cognito 
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function getUsernameFromCognito(event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;
    
    var username = event.requestContext.authorizer.claims.email;

    callback(null, success("Ingresaste correctamente con el user: " + username));
};
