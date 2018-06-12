var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({ region: "us-east-1" });

var docClient = new AWS.DynamoDB.DocumentClient();

var allNewspaper = JSON.parse(fs.readFileSync('netflix.newspaper.json', 'utf8'));
allNewspaper.forEach(function(newspaper) {

    let item = {};

    if(newspaper._id)item.mongoId = newspaper._id;

    if(newspaper.itsNational)item.itsNational = true;
    if(!newspaper.itsNational)item.itsNational = false;

    if(newspaper.name)item.name = newspaper.name;
    if(newspaper.url)item.url = newspaper.url;
    if(newspaper.base)item.base = newspaper.base;
    if(newspaper.baseUrl)item.baseUrl = newspaper.baseUrl;
    if(newspaper.protocol)item.protocol = newspaper.protocol;
    if(newspaper.location)item.location = newspaper.location;
    if(newspaper.state)item.state = newspaper.state;
    if(newspaper.country)item.crawlerIdMongo = newspaper.country;
    
    
    var params = {
        TableName: "Newspaper",
        Item: item
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add newspaper", newspaper.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", newspaper.title);
       }
    });
});