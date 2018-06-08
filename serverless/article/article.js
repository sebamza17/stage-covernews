import uuid from "uuid";
import AWS from "aws-sdk";
import {success, failure} from '../libs/response-lib';
import * as dynamoDbLib from "../libs/dynamodb-lib";
import fs from 'fs';
import path from 'path';

AWS.config.update({ region: "us-east-1" });

export const get = async (event, context, callback) => {

  


  var docClient = new AWS.DynamoDB.DocumentClient();

  console.log("Querying for movies from 1985.");
  
  var params = {
      TableName : "Movies",
      KeyConditionExpression: "#yr = :yyyy",
      ExpressionAttributeNames:{
          "#yr": "year"
      },
      ExpressionAttributeValues: {
          ":yyyy":1985
      }
  };
  
  docClient.query(params, function(err, data) {
      if (err) {
        callback(null, failure(err));
      } else {
          // console.log("Query succeeded.");
          // data.Items.forEach(function(item) {
          //     console.log(" -", item.year + ": " + item.title);
          // });

          callback(null, success({ items: data.Items }));
      }
  });


  // try {
  //   const result = await dynamoDbLib.call("query", params);
  //   console.log(result);
  //   if (result.Item) {
  //     callback(null, success(result.Item));
  //   } else {
  //     callback(null, failure({ status: false, error: "Item not found." }));
  //   }
  // } catch (e) {
  //   console.log(e);
  //   callback(null, failure({ status: false }));
  // }


};

