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
var SpotifyWebApi = require('spotify-web-api-node');
var MongoClient = require('mongodb').MongoClient;
//var MongoUrl = "mongodb+srv://Mongo:MongoPassword@cluster0-nqsbw.mongodb.net/test?retryWrites=true&w=majority";

var MongoUrl = "mongodb+srv://kthorup:phone0102@cluster0-o9cfs.mongodb.net/test?retryWrites=true&w=majority";


// Spotify credentials
var credentials = {
	clientId : 'c55c1a845e4849979265cc8212637412',
    clientSecret : 'ba64c04b5c20452a994a29cdebf1b77c',
    redirectUri : 'http://musica-comp20.herokuapp.com/callback'
};
var spotifyApi = new SpotifyWebApi(credentials);

var userName = ''; // username of the current user
var user;
var login = '';


// Initializing app
var app = express();
app.use(express.static(__dirname + '/'))
   .use(cors())
   .use(cookieParser());

var port = process.env.PORT || 3000;
// var port = 8080;

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// FUNCTIONS FOR LOGING IN ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

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
    if(choice == null) {
        res.redirect("/#" + 
        querystring.stringify({
            status: 'fail',
            error: "Choose the user option"
        }));
    };
	
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
    login = req.query.login || null;

    if(login == null) { 
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

    			    res.redirect('/main_page.html#' +
          		    querystring.stringify({
          			    status: 'success',
                        user: JSON.stringify(user)
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
    } else {
        spotifyApi.clientCredentialsGrant().then(
            function(data) {

                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body['access_token']);
                res.redirect('/main_page.html#' +
                    querystring.stringify({
                        status: 'success',
                        user: JSON.stringify(user)
                }));
            },
            function(err) {
                console.log('Something went wrong when retrieving an access token', err);
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
	if(choice == null) {
        res.redirect("/#" + 
        querystring.stringify({
            status: 'fail',
            error: "Choose the user option"
        }));
    };
	
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
                		res.redirect("/callback?login=1");	
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
                		res.redirect('/callback?login=1');
                	};
                };
			});
        };
    });
});


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// FUNCTIONS FOR POSTING DATA //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

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
                        res.send("completed");
            			res.end();
            		};
            	});
        	};
        });
	});
});

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// FUNCTIONS FOR RETRIEVING DATA ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Function to refresh access token
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


// Function to retrieve spotify available genres
app.get('/get_genres', function(req, res) {
    var Options = {
      url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      headers: {
        'Authorization': 'Bearer ' + spotifyApi.getAccessToken()
      },
      json: true
    };

    request.get(Options, function(request, response) {
        data = response.body;
        res.send(data);
        res.end();
    });
});


// Function to retrieve tracks based on a genre
app.get('/get_genre_artists', function(req, res) {
    genre = req.query.genre;
    res.set('Content-Type', 'text/json');
    var Options = {
      url: 'https://api.spotify.com/v1/recommendations' + '?seed_genres=' + genre,
      headers: {
        'Authorization': 'Bearer ' + spotifyApi.getAccessToken()
      },
      json: true
    };

    request.get(Options, function(request, response) {
        data = response.body.tracks;
        var return_data = [];
        for (i = 0; i < data.length; i++) {
            var temp = {
                artists: {
                    name: data[i].artists[0].name,
                    id: data[i].artists[0].id,
                    href: data[i].artists[0].href
                },
                album: {
                    name: data[i].album.name,
                    image: data[i].album.images[0].url,
                    href: data[i].album.href,
                    release_date: data[i].album.release_date
                },
                genre: genre,
                duration: data[i].duration_ms,
                href: data[i].href,
                external_url: data[i].external_urls.spotify,
                id: data[i].id,
                name: data[i].name,
                preview_url: data[i].preview_url
            }
            return_data.push(temp);
        };
        res.send(JSON.stringify(return_data));
        res.end();
    });
});


app.get('/new_release', function(req, res) { // move this function into application.js
    var Options = {
      url: 'https://api.spotify.com/v1/browse/new-releases',
      headers: {
        'Authorization': 'Bearer ' + spotifyApi.getAccessToken()
      },
      json: true
    };

    request.get(Options, function(request, response) {
        data = response.body.albums.items;
        var return_data = [];
        for (i = 0; i < data.length; i++) {
            var temp = {
                artists: {
                    name: data[i].artists[0].name,
                    id: data[i].artists[0].id,
                    href: data[i].artists[0].href
                },
                album: {
                    name: data[i].name,
                    image: data[i].images[0].url,
                    href: data[i].href,
                    release_date: data[i].release_date
                },
            }
            return_data.push(temp);
        };
        res.send(JSON.stringify(return_data));
        res.end();
    });
});


// Function to get artists songs based on artist id
app.get('/get_artist_songs', function(req, res) {
    var artist_id = req.query.artist_id;
    res.set('Content-Type', 'text/json');

    var Options = {
        url: 'https://api.spotify.com/v1/artists/' + artist_id + '/top-tracks?country=US',
        headers: {
          'Authorization': 'Bearer ' + spotifyApi.getAccessToken()
        },
        json: true,
    };

    request.get(Options, function(request, response) {
        var data = response.body.tracks;
        var return_data = [];
        for (i = 0; i < 10; i++) {
            var temp = {
                artists: {
                    name: data[i].artists[0].name,
                    id: data[i].artists[0].id,
                    href: data[i].artists[0].href
                },
                album: {
                    name: data[i].album.name,
                    image: data[i].album.images[0].url,
                    href: data[i].album.href,
                    release_date: data[i].album.release_date
                },
                genre: 'unknown',
                duration: data[i].duration_ms,
                href: data[i].href,
                external_url: data[i].external_urls.spotify,
                id: data[i].id,
                name: data[i].name,
                preview_url: data[i].preview_url
            }
            return_data.push(temp);
        };
        res.send(JSON.stringify(return_data));
        res.end();
    });
});

// Function to search for an artists with the queried name
app.get('/search_artist', function(req,res){
    var artist = req.query.artist;
    res.set('Content-Type', 'text/json');

    var Options = {
      url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
      headers: {
        'Authorization': 'Bearer ' + spotifyApi.getAccessToken()
      },
      json: true,
    };

    request.get(Options, function(request, response) {
        var artist_id = response.body.artists.items[0].id;
        res.send(artist_id);
        res.end();
    });
});

app.listen(port);
