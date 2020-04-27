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
    if (req.method == 'GET' && req.url != '/favicon.ico') {
        MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {
            if (err)
                return console.log("Error connecting to DB: " + err);

            var dbo = db.db("Comp20Final");
            var collection = dbo.collection("Users");
            var user
            collection.find().toArray(async (err, items) => {
                if (err)
                    return console.log(err);
                user = findUser(items, userName);
                if (user == 0) {
                    console.log("adding: " + userName);
                    addUser(collection, userName);
                }
                else {
                    //var song = {title: "Gorgeous", artist: "slowthai"};
                    //addSongs(collection, user, song);
                    getDisplaySongs(user);
                }
            });
        });
    }
    res.end();
}).listen(8080);

// Add user
function addUser(collection, userName) {
    var songs = []
    var record = {"userName": userName, "songs": songs};
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

// Adds songs to user account
function addSongs(collection, user, newSongs)
{
    var query = {"userName": user.userName};
    songs = user.songs;
    songs.push(newSongs);
    var update = {$set: {"songs": songs}};
    collection.updateOne(query, update, (err, res) => {
        if (err)
            return console.log(err);
    });
}

function getDisplaySongs(user)
{
    var display = [];
    var first = user.songs.length - 1;
    var last;
    if (first >= 5)
        last = first - 5;
    else   
        last = 0;
    for (i = first; i >= last; i--) {
        //display.push(user.songs[i])
        console.log(user.songs[i]);
    }
}