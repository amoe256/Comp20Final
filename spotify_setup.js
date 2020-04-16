/* Client ID: c55c1a845e4849979265cc8212637412 
   Client Secret: ba64c04b5c20452a994a29cdebf1b77c */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
//var cors = require('cors');
var querystring = require('querystring');
//var cookieParser = require('cookie-parser');

var client_id = 'c55c1a845e4849979265cc8212637412';
var client_secret = 'ba64c04b5c20452a994a29cdebf1b77c'; // secret
var redirect_uri = 'http://localhost:8080/callback.html'; // redirect uri

var app = express();

app.use(express.static(__dirname + '/public'))
   //.use(cors())
   //.use(cookieParser());

app.get('/login', function(req, res) {
var scopes = 'user-read-private user-read-email';
res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + client_id +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/callback', function(req, res) {
	res.write("entered callback")

  	// your application requests refresh and access tokens
  	// after checking the state parameter

  	var code = req.query.code || null;

  	var authOptions = {
    	url: 'https://accounts.spotify.com/api/token',
     	form: {
        	code: code,
        	redirect_uri: redirect_uri,
        	grant_type: 'authorization_code'
      	},
      	headers: {
        	'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      	},
      	json: true
   		};

   	res.write("Created authOptions")

    request.post(authOptions, function(error, response, body) {
      	if (!error && response.statusCode === 200) {

        	var access_token = body.access_token;
            var refresh_token = body.refresh_token;

        	var options = {
          	url: 'https://api.spotify.com/v1/me',
          	headers: { 'Authorization': 'Bearer ' + access_token },
          	json: true
        	};

        	// use the access token to access the Spotify Web API
        	request.get(options, function(error, response, body) {

        	});

        	// we can also pass the token to the browser to make requests from there
        	//res.redirect('/#' +
          	//querystring.stringify({
            //	access_token: access_token,
            //	refresh_token: refresh_token
          	//}));
     	} else {
        res.redirect('/#' +
          	querystring.stringify({
            error: 'invalid_token'
          }));
      	}
   	});
 });

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
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

/*app.get('/get_playlist', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
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
});*/


console.log('listening on 8080');

app.listen(8080);