var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({ region: "us-east-1" });

var docClient = new AWS.DynamoDB.DocumentClient();

var allMovies = JSON.parse(fs.readFileSync('journalist.json', 'utf8'));
allMovies.forEach(function(movie) {

    let item = {};

    if(movie.show)item.isShow = 'true';
    if(!movie.show)item.isShow = 'false';

    if(movie.name)item.author = movie.name;
    if(movie.avatar)item.avatar = movie.avatar;
    if(movie.amount)item.amount = movie.amount;
    if(movie.description)item.description = movie.description;
    if(movie.facebook)item.facebook = movie.facebook;
    if(movie.instagram)item.instagram = movie.instagram;
    if(movie.twitter)item.twitter = movie.twitter;

    var params = {
        TableName: "Journalist",
        Item: item
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", movie.name);
       }
    });
});