
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