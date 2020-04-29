/*
application.js

Author: Katya Thorup
Date created: 4/13/2020

Modified by: Katya Thorup / Max Peicher
Last modified: 4/28/2020

Assignment: Comp20Final
Purpose: Create a server to serve Musica application HTML pages
*/

// Modules used in this porject
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var mongoFunc = require('./mongodb.js');
//var spotifyFunc = require('./spotifyAPI.js');    
var SpotifyWebApi = require('spotify-web-api-node');
var MongoClient = require('mongodb').MongoClient;
//var MongoUrl = "mongodb+srv://Mongo:MongoPassword@cluster0-nqsbw.mongodb.net/test?retryWrites=true&w=majority";

var MongoUrl = "mongodb+srv://kthorup:phone0102@cluster0-o9cfs.mongodb.net/test?retryWrites=true&w=majority";

var credentials = {
	clientId : 'c55c1a845e4849979265cc8212637412',
    clientSecret : 'ba64c04b5c20452a994a29cdebf1b77c',
    redirectUri : 'http://localhost:8080/callback'
};
var spotifyApi = new SpotifyWebApi(credentials);

var userName = ''; // username of the current user
var userData = {}; // data for the user
var user;

var app = express();
app.use(express.static(__dirname + '/'))
   .use(cors())
   .use(cookieParser());

//var port = process.env.PORT || 3000;
var port = 8080;

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.get('/loginSpotify', function(req, res) {

	userName = req.query.user_in || null;
	var choice = req.query.user_status || null;
	
	//Establish mongo connection and query for the user
	MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {

        if (err) {
            res.redirect("/#" + 
            	querystring.stringify({
      				status: 'fail',
        			error: "Could not connect to database. Please try again"
      		}));
        }
        else {
        	var dbo = db.db("Comp20Final");
        	var collection = dbo.collection("Users");

        	collection.find().toArray(async (err, items) => {
            	if (err) {
            		res.redirect("/#" + 
            		querystring.stringify({
      					status: 'fail',
        				error: err
      				}));
            	}
            	else {
            		user = await mongoFunc.mongoObj.findUser(items, userName);
            		if ((user == 0) && (choice == "newUser")) {
                		await mongoFunc.mongoObj.addUser(collection, userName);
                		
                		var state = generateRandomString(16);
						res.cookie(stateKey, state);

						// your application requests authorization
						var scopes = ['user-read-private', 'user-read-email'];
						var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
						res.redirect(authorizeURL);
                	}
               		else if ((user == 0) && (choice == "oldUser")) {
                    	res.redirect("/#" + 
            				querystring.stringify({
      							status: 'fail',
        						error: 'Username not found'
      					}));
                	}
                	else if ((user != 0) && (choice == "newUser")) {
                		res.redirect("/#" + 
            				querystring.stringify({
      							status: 'fail',
        						error: "Username already exists. Please choose a new one"
      					}));
                	}
                	else {
                		userData = await mongoFunc.mongoObj.getDisplaySongs(user);

                		var state = generateRandomString(16);
						res.cookie(stateKey, state);

						// your application requests authorization
						var scopes = ['user-read-private', 'user-read-email'];
						var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
						res.redirect(authorizeURL);
                	};
                };
        
			});
        };
    });
});

app.get('/callback', function(req, res) {

  	// your application requests refresh and access tokens
  	// after checking the state parameter

  	var code = req.query.code || null;
  	var state = req.query.state || null;
  	var storedState = req.cookies ? req.cookies[stateKey] : null;

  	if (state === null || state !== storedState) {
    	res.redirect('/#' +
      	querystring.stringify({
      		status: 'fail',
        	error: 'state_mismatch'
      	}));
  	} else {
    	res.clearCookie(stateKey);

    	spotifyApi.authorizationCodeGrant(code).then(
  			function(data) {
    			// Set the access token on the API object to use it in later calls
    			spotifyApi.setAccessToken(data.body['access_token']);
    			spotifyApi.setRefreshToken(data.body['refresh_token']);

    			res.redirect('/#' +
          		querystring.stringify({
          			status: 'success',
          			userdata: JSON.stringify(userData)
          		}));
  			},
  			function(err) {
    			res.redirect('/#' +
        		querystring.stringify({
        			status: 'fail',
            		error: 'invalid_token'
          		}));
  			}
		);
	};
});

/*
 Purpose: code to login without requesting Spotify access
          (use out own access code);
*/
app.get('/login', function(req, res) {

	userName = req.query.user_in || null;
	var choice = req.query.user_status || null;
	//console.log("Name is: " + userName + " choice is: " + choice);
	
	//Establish mongo connection and query for the user
	MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {
		//console.log("Trying to connect");
        if (err) {
            res.redirect("/#" + 
            	querystring.stringify({
      				status: 'fail',
        			error: "Could not connect to database. Try again"
      		}));
        }
        else {
        	var dbo = db.db("Comp20Final");
        	var collection = dbo.collection("Users");

        	collection.find().toArray(async (err, items) => {
            	if (err) {
            		res.redirect("/#" + 
            		querystring.stringify({
      					status: 'fail',
        				error: err
      				}));
            	}
            	else {
            		user = await mongoFunc.mongoObj.findUser(items, userName);
            		if ((user == 0) && (choice == "newUser")) {
                		await mongoFunc.mongoObj.addUser(collection, userName);
                		res.redirect("/#" + 
            			querystring.stringify({
      						status: 'success',
      						userdata: JSON.stringify(userData)
      					}));	
                	}
               		else if ((user == 0) && (choice == "oldUser")) {
                    	res.redirect("/#" + 
            				querystring.stringify({
      							status: 'fail',
        						error: 'Username not found'
      					}));
                	}
                	else if ((user != 0) && (choice == "newUser")) {
                		res.redirect("/#" + 
            				querystring.stringify({
      							status: 'fail',
        						error: "Username already exists. Please choose a new one"
      					}));
                	}
                	else {
                		userData = await mongoFunc.mongoObj.getDisplaySongs(user);
                		res.redirect("/#" + 
            				querystring.stringify({
      							status: 'success',
        						userdata: JSON.stringify(userData)
      					}));
                	};
                };
			});
        };
    });
});


/*
 Purpose: code to save data to the server under a given username
*/
app.post('/post', function(req, res) {
	var body = '';
	req.on('data', function(chunk){
		body += chunk;
	});
	req.on('end', function() {

		//Establish mongo connection and query for the user
		MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, function(err, db) {
			res.set('Content-Type', 'text/plain');
        	if (err) {
            	res.send(err);
            	res.end();
        	}
        	else {
        		var dbo = db.db("Comp20Final");
        		var collection = dbo.collection("Users");

        		collection.find().toArray(async (err, items) => {
            		if (err) {
            			res.send(err);
            			res.end();
            		}
            		else {
            			body = JSON.parse(body);
            			var mongo_return = await mongoFunc.mongoObj.addSongs(collection, user, body);
            			res.end();
            		};
            	});
        	};
        });
	});
});


app.get('/refresh_token', function(req, res) {

	res.set('Content-Type', 'text/plain');

	spotifyApi.refreshAccessToken(function(err, data) {
        if(err) {
            res.send(err);
            res.end();
        }
        else {
            spotifyApi.setAccessToken(data.body['access_token']);
            res.send("Token refreshed");
            res.end();
        };
    });
});

app.get('/get_artist', async function(req, res) {
    
    spotifyApi.searchArtists(query).then(
        function(data) {
            res.send(data.body);
            res.end();
        },
        function(err) {
            console.log(err);
            res.end();
    });
});

app.listen(port);