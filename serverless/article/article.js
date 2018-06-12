
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
        TableName: "Article",
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

    if(!event.pathParameters || !event.pathParameters.title){
        callback(null, failure({error: 'No event parameters',stack: event.pathParameters}));
        return;
    }

    event.pathParameters.title = decodeURI(event.pathParameters.title).toLowerCase();

    const params = {
        TableName: "Article",
        ProjectionExpression: "title, #url, canonical, authorName",
        FilterExpression: "contains(lowerTitle,:t)",
        ExpressionAttributeNames: {
            "#url": "url"
        },
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


/**
 * Search by year
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export async function getByAuthor (event, context, callback) {

    if(!event.pathParameters || !event.pathParameters.authorName){
        callback(null, failure({error: 'No event parameters',stack: event.pathParameters}));
        return;
    }

    event.pathParameters.authorName = decodeURI(event.pathParameters.authorName).toLowerCase();

    const params = {
        TableName: "Article",
        ProjectionExpression: "title, #url, canonical, authorName, authorNameLower",
        FilterExpression: "contains(authorNameLower,:t)",
        ExpressionAttributeNames: {
            "#url": "url"
        },
        ExpressionAttributeValues: {
             ":t": event.pathParameters.authorName
        }
      };
    
    try{
        const result = await dynamoDbLib.call('scan',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};