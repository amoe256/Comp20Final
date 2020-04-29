/*
spotifyAPI.js
Author: Max Peicher
Date created: 4/26/2020

Modified by: Katya Thorup
Last modified: 4/27/2020

Assignment: Comp20Final
Purpose: Handle all operations concerning spotify API access
*/
var SpotifyWebApi = require('spotify-web-api-node');

var credentials = {
    clientId : 'c55c1a845e4849979265cc8212637412',
    clientSecret : 'ba64c04b5c20452a994a29cdebf1b77c',
    redirectUri : 'http://localhost:8080/callback'
};
var spotifyApi = new SpotifyWebApi(credentials);

exports.spotifyObj = {

    refreshToken: spotifyApi.refreshAccessToken(function(err, data) {
        if(err) {
            return err;
        }
        else {
            spotifyApi.setAccessToken(data.body['access_token']);
            return 'Token refreshed';
        };
    })
};
