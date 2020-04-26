/*
user_database.js
Author: Andreas Moe
Date: 4/26/2020
Assignment: Comp20Final
Purpose: Handle all operations concerning a Mongo DB of user accounts
*/

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = "mongodb+srv://Mongo:MongoPassword@cluster0-nqsbw.mongodb.net/test?retryWrites=true&w=majority";
const http = require('http');
const url = require ('url');

// Server init
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    var formData = url.parse(req.url, true).query;
    var userName = formData.userName;
    
    if (req.method == 'GET') {
        MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {
            if (err)
                return console.log("Error connecting to DB: " + err);

            var dbo = db.db("Comp20Final");
            var collection = dbo.collection("Users");
            var user
            collection.find().toArray(async (err, items) => {
                if (err)
                    return console.log(err);
                user = await findUser(items, userName);
                if (user == 0) {
                    //await addUser(collection, userName);
                }
                else {
                    //await deleteUser(collection, userName);
                }
            })
        });
    }
    res.end();
}).listen(8080);

// Add user
function addUser(collection, userName) {
    var record = {"userName": userName};
    collection.insertOne(record, (err, res) => {
        if (err)
            return console.log(err);
    })
}

// Delete user
function deleteUser(collection, userName) {
    var query = {"userName": userName};
    collection.deleteOne(query, (err, res) => {
        if (err)
            return console.log(err);
    })
}

// Find user
// Returns user's record if in DB, 0 otherwise
function findUser(users, userName)
{
    for (i = 0; i < users.length; i++) {
         if (users[i].userName == userName)
             return users[i];
    }
    return 0;
}