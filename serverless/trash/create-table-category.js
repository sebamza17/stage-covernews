var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Category",
    KeySchema: [       
        { AttributeName: "name", KeyType: "HASH"},
        { AttributeName: "canonical", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [       
        { AttributeName: "name", AttributeType: "S"},
        { AttributeName: "canonical", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 100, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});