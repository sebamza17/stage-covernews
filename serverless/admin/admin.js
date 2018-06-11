
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
        TableName: "Articles",
        KeyConditionExpression: "canonical = :canonical",
        ExpressionAttributeValues: {
             ":canonical": event.pathParameters.canonical
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
        TableName: "Articles",
        ProjectionExpression: "title, canonical, url",
        FilterExpression: "contains(title,:t)",
        ExpressionAttributeValues: {
             ":t": event.pathParameters.title
        }
      };
    
    try{
        const result = await dynamoDbLib.call('scan',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};