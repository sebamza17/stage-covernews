
import {success, failure} from '../libs/response-lib';
import * as dynamoDbLib from '../libs/dynamodb-lib';

/**
 * Get All
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function get (event, context, callback) {

    const params = {
        TableName: "Journalist",
        KeyConditionExpression: "author = :t",
        ExpressionAttributeValues: {
             ":t": event.pathParameters.name
        }
      };
    
    try{
        const result = await dynamoDbLib.call('query',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};

/**
 * Search by year
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function search (event, context, callback) {

    if(!event.pathParameters || !event.pathParameters.name){
        callback(null, failure(event.pathParameters));
        return;
    }

    const params = {
        TableName: "Journalist",
        ProjectionExpression: "author, isShow, avatar",
        FilterExpression: "contains(author,:t)",
        ExpressionAttributeValues: {
             ":t": event.pathParameters.name
        }
      };
    
    try{
        const result = await dynamoDbLib.call('scan',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};