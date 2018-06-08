import uuid from "uuid";
import AWS from "aws-sdk";
import {success, failure} from '../libs/response-lib';
import * as dynamoDbLib from "../libs/dynamodb-lib";
import fs from 'fs';
import path from 'path';

AWS.config.update({ region: "us-east-1" });
let docClient = new AWS.DynamoDB.DocumentClient();

function getArticles(params,callback){
  
  console.log("Params",params);

  docClient.query(params, function(err, data) {
    if (err) {
      callback(null, failure(err));
      return;
    }
    callback(null, success({ items: data.Items }));
  });
};

export const get = async (event, context, callback) => {
  let params = {
    TableName : "Movies",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy":1985
    }
  };
  getArticles(params,callback);
};

