/*
mongodb.js
Author: Andreas Moe
Date: 4/26/2020
Assignment: Comp20Final
Purpose: Handle all operations concerning a Mongo DB of user accounts
*/

exports.mongoObj = {
    // add user
    addUser: function(collection, userName) {
        var record = {"userName": userName};
        collection.insertOne(record, (err, res) => {
            if (err) {
                return 0;
            }
            else {
                return 1;
            };
        });
    },

    // delete user
    deleteUser: function(collection, userName) {
        var query = {"userName": userName};

        collection.deleteOne(query, (err, res) => {
            if (err) {
                return 0;
            }
            else {
                return 1;
            };
        })
    },

    // Find user
    // Returns user's record if in DB, 0 otherwise
    findUser: function (users, userName) {

        for (i = 0; i < users.length; i++) {

            if (users[i].userName == userName) {

                return users[i];
            };
        }
    return 0;
    }

    // Adds songs to user account
    addSongs: function (collection, user, newSongs) {

        var query = {"userName": user.userName};

        songs = user.songs;

        songs.push(newSongs);

        var update = {$set: {"songs": songs}};

        collection.updateOne(query, update, (err, res) => {

        if (err) { return 0; };

        });

    }

    getDisplaySongs: function(user) {

        var display = [];
        var first = user.songs.length - 1;
        var last;

        if (first >= 5) {
            last = first - 5;
        }
        else {
            last = 0;
        };

        for (i = first; i >= last; i--) {

        //display.push(user.songs[i])

        console.log(user.songs[i]);
        }
    }
};