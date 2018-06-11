
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
        TableName: "Category",
        KeyConditionExpression: "#name = :name",
        ExpressionAttributeNames: {
            "#name": "name",
        },
        ExpressionAttributeValues: {
             ":name": event.pathParameters.name
        }
      };
    
    try{
        const result = await dynamoDbLib.call('query',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};