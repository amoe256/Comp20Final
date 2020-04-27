var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var mongoFunc = require('./mongodb.js');

var MongoClient = require('mongodb').MongoClient;
//var MongoUrl = "mongodb+srv://Mongo:MongoPassword@cluster0-nqsbw.mongodb.net/test?retryWrites=true&w=majority";

var MongoUrl = "mongodb+srv://kthorup:phone0102@cluster0-o9cfs.mongodb.net/test?retryWrites=true&w=majority";

var SpotifyWebApi = require('spotify-web-api-node');

var client_id = 'c55c1a845e4849979265cc8212637412';
var client_secret = 'ba64c04b5c20452a994a29cdebf1b77c'; // secret
var redirect_uri = 'http://localhost:8080/callback'; // redirect uri

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});

var userName = ''; // username of the current user
var userData = 0; // data for the user

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

        	var user;

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
						var scope = 'user-read-private user-read-email';
						res.redirect('https://accounts.spotify.com/authorize?' +
							querystring.stringify({
  								response_type: 'code',
  								client_id: client_id,
  								scope: scope,
  								redirect_uri: redirect_uri,
  								state: state
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
                		userData = "Hello";

                		var state = generateRandomString(16);
						res.cookie(stateKey, state);

						// your application requests authorization
						var scope = 'user-read-private user-read-email';
						res.redirect('https://accounts.spotify.com/authorize?' +
							querystring.stringify({
  								response_type: 'code',
  								client_id: client_id,
  								scope: scope,
  								redirect_uri: redirect_uri,
  								state: state
    					}));

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
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        spotifyApi.setAccessToken(access_token);

        // Mongo connection -> get data or gata data and check for user

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
          	status: 'success',
          	userData: userData,
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
        	querystring.stringify({
        		status: 'fail',
            	error: 'invalid_token'
          }));
      	}
    });
  }
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
        	console.log("Error is: " + err);
            res.redirect("/#" + 
            	querystring.stringify({
      				status: 'fail',
        			error: "Could not connect to database. Try again"
      		}));
        }
        else {
        	var dbo = db.db("Comp20Final");
        	var collection = dbo.collection("Users");

        	var user;
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
      						userData: userData
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
                		// find user data
                		res.redirect("/#" + 
            				querystring.stringify({
      							status: 'success',
        						userData: userData
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
	req.on('end', function(){
		// Mongo post data to user
		body = JSON.parse(body);
		res.set('Content-Type', 'text/plain')
		res.send("Data posted");
		res.end();
	});
});


app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.listen(port);