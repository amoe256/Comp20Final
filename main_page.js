/*
var song = {
      artists: {
          name: artist name,
          id: artist id,
          href: artist href
      },
      album: {
          name: almbum name,
          image: album image,
          href: almbum href,
          release_date: album release_date
      },
      genre: track genre,
      duration: track duration_ms,
      href: track href,
      external_url: external url to track,
      id: track id,
      name: track name,
      preview_url: track preview_url
  }


var user = {
  name: name of user,
  playlists: [{playlist object}]
  favorites: [song objects]
}

playlist object = {
  name: playlist name,
  songs = []
}
*/

var user_playlists;
var user_favorites;
var user;

// Function executed on the load of the page to retrieve user data
function getData() {
  function getHashParams() {
    var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
  };

  var params = getHashParams();
  var key = params.status;
  var err = params.error;
  var data = JSON.parse(params.user);
  user = data;
  user_playlists = data.playlists;
  user_favorites = data.user_favorites;
  if(key == "fail") {
    alert("User data not loaded. Please relogin");
  };
}

// This function writes anything on the right part/display
// image part of the page. The data array is from other 
// functions from the MongoDB functions. Therfore, it can also
// be considered as a print function.
function printTracksToPage(data) {

    listSongs = "";
    listSong = "";
    listSong += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
    listSong += "<div class='here'><h1>Your Tracks! Hover on image to listen.</h1></div><br>";
      for (i = 0; i < data.length; i++) {
        var temp = "'" + JSON.stringify(data[i]) + "'";
        if (i %2 == 0) {
        listSongs += "<div class='row'><div class='col-sm-3' style='background-color:white;'>";
        listSongs += "<audio id='audioID"+i+"'><source src='" + data[i].preview_url + "' type='audio/mpeg'></audio>";
        listSongs += "<a href='#' onmouseenter='playAudio("+i+")'onmouseout='stopAudio("+i+")' onclick='playAudio("+i+")'><img src='" + data[i].album.image + "'";
        listSongs += "style='width:45% border-radius: 100%' class='zoom' style='text-align: center;'></a></div>";
        listSongs += "<div class='col-sm-6' style='background-color:white;'>";
        listSongs += "<table><tr><td><h5>Song: " + data[i].name + "</h5></td><td style='text-align: right'>Album: " + data[i].album.name + "</td></tr>";
        listSongs += "<tr><td><h5>Artist: " + data[i].artists.name + "</h5></td><td style='text-align: right'>Duration in ms: " + data[i].duration + "</td></table>"
        listSongs += "</div><div class='col-sm-3' style='background-color:white; '>";
        listSongs += "<button><i class='fas fa-plus' style='color: #4842A1; size: 10px;''></i></button>";
        listSongs += "<button value='" + temp + "' onclick='checkFavorites(this.value)' class ='like'><i id='" + data[i].name + "'class='fas fa-heart' style='color:red'></i></i></button>";
        listSongs += "<button><i class='fas fa-share' style='color: #4CAF50'></i></button>";
        listSongs += "</div></div><hr class='horizontal_line'>";
      }

      else {
        listSongs += "<div class='row'><div class='col-sm-3' style='background-color:white;'>";
        listSongs += "<audio id='audioID"+i+"'><source src='" + data[i].preview_url + "' type='audio/mpeg'></audio>";
        listSongs += "<a href='#' onmouseenter='playAudio("+i+")' onmouseout='stopAudio("+i+")' onclick='playAudio("+i+")'><img src='" + data[i].album.image + "'";
        listSongs += "style='width:45% border-radius: 100%' class='zoom' style='text-align: center;'></a></div>";
        listSongs += "<div class='col-sm-6' style='background-color:white;'>";
        listSongs += "<table><tr><td><h5>Song: " + data[i].name + "</h5></td><td style='text-align: right'>Album: " + data[i].album.name + "</td></tr>";
        listSongs += "<tr><td><h5>Artist: " + data[i].artists.name + "</h5></td><td style='text-align: right'>Duration: " + data.duration + "</td></table>"
        listSongs += "</div><div class='col-sm-3' style='background-color:white; '>";
        listSongs += "<button><i class='fas fa-plus' style='color: #4842A1; size: 10px;''></i></button>";
        listSongs += "<button value='" + temp + "' onclick='checkFavorites(this.value)' class ='like'><i id='" + data[i].name + "'class='fas fa-heart' style='color:red'></i></i></button>";
        listSongs += "<button><i class='fas fa-share' style='color: #4CAF50'></i></button>";
        listSongs += "</div></div><hr class='horizontal_line'>";
      };

    };

    listSongs += "</div></div>";
    document.getElementById("list-homepage-songs").innerHTML = listSong + listSongs;
}


function playAudio(id) {
  var audio1 = document.getElementById("audioID" + id);
  audio1.play();
}


function stopAudio(id) {
  var audio1 = document.getElementById("audioID" + id)
  audio1.pause();
}

// Function to retrieve spotify available genres and print them to the screen
function listGenreFromDatabase(){
  var request = new XMLHttpRequest();
  request.open("GET", '/get_genres', true);
  request.setRequestHeader('Content-type', 'application/text');

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var genre = JSON.parse(request.responseText);
      genre = genre.genres;
      listTheGenre = "";
      listTheGenre += "<div class='here' style='color: black'><h1 >Our Genres!</h1></div>";
      genreName ="<div class='table-shadow'><table>";
      for (i = 0; (i < genre.length); i+=3) {
        genreName += "<tr><td><button class='table-button' value='" + genre[i] + "' onclick='getTracks(this.value)'>" + genre[i] + "</button>";
        genreName += "</td><td><button class='table-button' value='" + genre[i+1] + "' onclick='getTracks(this.value)'>" + genre[i+1] + "</button>";
        genreName += "</td><td><button class='table-button' value='" + genre[i+2] + "' onclick='getTracks(this.value)'>" + genre[i+2] + "</button></td></tr>";
      };
      genreName += "</table></div>";
      document.getElementById("list-homepage-songs").innerHTML = listTheGenre + genreName;
    };
  };
  request.send();  
};


// Function to find all the tracks related to user choosen genre
function getTracks(value) {
    url = "/get_genre_artists" + "?genre=" + value;

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.setRequestHeader('Content-type', 'text/plain');

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          data = request.responseText;
          data = JSON.parse(data);
          printTracksToPage(data);
        };
    };
    request.send();
}


// Function to find all possible info on the artists inputed into the search bar
function getArtistInfo() {
};


// Function to add the song to the Favorites list
function checkFavorites(value) {
  var data = JSON.parse(value);
  var name = data.name;
  var color = document.getElementById(name).style.color;
  alert(color);
};


function showFavorites() {
  printTracksToPage(user_favorites);
};

// Function to retrieve and print the user playlists stored in mongoDB
function showLocalPlaylists() {
  str = "<div class='here' style='color: black'><h1 >Our Genres!</h1></div>";
  str += "<button class='table-button' onclick='createPlaylist()'>Create New Playlist</button><br>";
  
  if(user_playlists.length == 0) {
    document.getElementById("list-homepage-songs").innerHTML = str;
  }
  else {
    for (i = 0; i < user_playlists.length; i++) {
      str += "<div class='addedPlaylist'>";
      str += "<button class='playlist_button' value='" + user_playlists[i].name + "' onclick='getPlaylistSongs(this.value)'>"; 
      str += user_playlists[i].name + "</button>";
      str += "<button type='button'><i class='fa fa-search' value='";
      str += user_playlists[i].name + "'onclick='deletePlaylist(this.value)'></i></button>";
      str += "</div>";
    };
      str += "</tr></table></div>";
      document.getElementById("list-homepage-songs").innerHTML = str;
  };
};


function deletePlaylist(name) {
  // remove playlist fron the user
  // call showLocalPlaylists()

};


// Function to display all of the songs saved to the choosen user playlist
function getPlaylistSongs(name) {
};


// Function to create a new user playlist
function createPlaylist() {
  var name = prompt("What do you want to call your playlist?");
  if ((name == null) || (name == "")) {
    name = "default";
  };

  var playlist = {"name": name, "songs":[]};
  user_playlists.push(playlist);
  str = "<br><br><div class='addedPlaylist'>";
  str += "<button class='playlist_button' value='" + name + "' onclick='getPlaylistSongs(this.value)'>"; 
  str += name + "</button>";
  str += "<button type='button'><i class='fa fa-search' value='";
  str += name + "'onclick='deletePlaylist(this.value)'></i></button>";
  str += "</div>";
  var text = document.getElementById("list-homepage-songs").innerHTML;
  text = text + str;
  document.getElementById("list-homepage-songs").innerHTML = text;
};


// Function to add the chosen song to user Playlists
function addToPlaylist() {
};


// Function to save user data to mongoDB
function postData() {
  user.playlists = user_playlists;
  user.favorites = user_favorites;
  var to_send = user;
  to_send = JSON.stringify(to_send);
  url = "/post";

  var request = new XMLHttpRequest();
  request.open("POST", url, true);

  request.setRequestHeader('Content-type', 'application/json');

  request.onreadystatechange = function() {
  if (request.readyState == 4 && request.status == 200) {
     alert("Data posted");
  };
};
request.send(to_send);

};


// Function to refresh user access token. Might not be nessesarry
function refreshToken() {
  url = "/refresh_token";

  var request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.setRequestHeader('Content-type', 'application/text');

  request.onreadystatechange = function() {
  if (request.readyState == 4 && request.status == 200) {
    response = request.responseText;
    if (response != "Token refreshed") {
        alert("Token not refreshed because: " + response);
    };
  };
  };
request.send();
}
