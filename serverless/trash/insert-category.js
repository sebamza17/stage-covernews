var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({ region: "us-east-1" });

var docClient = new AWS.DynamoDB.DocumentClient();

var allcategory = JSON.parse(fs.readFileSync('netflix.category.json', 'utf8'));
allcategory.forEach(function(category) {

    let item = {};

    if(category._id)item.mongoId = category._id;

    if(category.name)item.name = category.name;
    if(category.url)item.canonical = category.url;
    if(category.displayName)item.displayName = category.displayName;
    if(category.createAt)item.createAt = category.createAt;
    if(category.amount)item.amount = category.amount;
    
    var params = {
        TableName: "Category",
        Item: item
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add category", category.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", category.title);
       }
    });
});