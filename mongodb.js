/*
mongodb.js

Author: Andreas Moe
Date created: 4/26/2020

Modified by: Katya Thorup
Last modified: 4/27/2020

Assignment: Comp20Final
Purpose: Handle all operations concerning a Mongo DB of user accounts
*/

exports.mongoObj = {
    // add user to the database
    addUser: function(collection, userName) {
        var songs = [];
        var record = {"userName": userName, "songs": songs};

        collection.insertOne(record, (err, res) => {
            if (err) {
                return 0;
            }
            else {
                return 1;
            };
        });
    },

    // delete user from the database
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
    },

    // Adds songs to user account
    // Return 1 if succesffull, 0 if not successfull
    addSongs: async function (collection, user, newSongs) {

        var query = {"userName": user.userName};
        songs = user.songs;

        for (i = 0; i < newSongs.length; i++) {
            songs.push(newSongs[i]);
        };

        var update = {$set: {"songs": songs}};
        collection.updateOne(query, update, (err, res) => {
            if (err) {
                return err;
            }
            else {
                return "Data posted";
            };
        });
    },

    // Retrieve last 5 songs added to user account or less from the user object
    // Return the list of songs if successfull. Otherwise return 0
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
            display.push(user.songs[i]);
        };

        if(display.length == 0) {
            return 0;
        }
        else {
            return display;
        };
    }
};