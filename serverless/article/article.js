
import {success, failure} from '../libs/response-lib';
import * as dynamoDbLib from '../libs/dynamodb-lib';

export async function get (event, context, callback) {

    const params = {
      TableName : "Movies",
      KeyConditionExpression: "#yr = :yyyy",
      ExpressionAttributeNames:{
          "#yr": "year"
      },
      ExpressionAttributeValues: {
          ":yyyy":1985
      }
    };
    
    try{
        const result = await dynamoDbLib.call('query',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};

export async function search (event, context, callback) {

    console.log(event.pathParameters.criteria);

    const params = {
      TableName : "Movies",
      KeyConditionExpression: "#yr = :yyyy",
      ExpressionAttributeNames:{
          "#yr": "year"
      },
      ExpressionAttributeValues: {
          ":yyyy": parseInt(event.pathParameters.criteria)
      }
    };
    
    try{
        const result = await dynamoDbLib.call('query',params);
        callback(null, success(result.Items));
    }catch(err){
        callback(null, failure(err));
    }

};