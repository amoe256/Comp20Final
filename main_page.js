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
  playlists: [{"name": "favorites, "songs":[]}, {playlist object}]
}

playlist object = {
  "name": playlist name,
  "songs": []
}
*/

var user_playlists; // global variable to keep track of all user songs
var temp_songs; // global variable used to keep track of songs loaded from SPOTIFY API

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
  user_playlists = data.playlists;
  if(key == "fail") {
    alert("User data not loaded. Please relogin");
  };
}

// This function writes anything on the right part/display
// image part of the page. The data array is from other 
// functions from the MongoDB functions. Therfore, it can also
// be considered as a print function.
function printTracksToPage(data, sel) {

    listSongs = "";
    listSong = "";
    listSong += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
    listSong += "<div class='here'><h1>Your Tracks! Hover on image to listen.</h1></div><br>";
      for (i = 0; i < data.length; i++) {
        if (i %2 == 0) {
          listSongs += "<div class='row'><div class='col-sm-3' style='background-color:white;'>";
          listSongs += "<audio id='audioID"+i+"'><source src='" + data[i].preview_url + "' type='audio/mpeg'></audio>";
          listSongs += "<a href='#' onmouseenter='playAudio("+i+")'onmouseout='stopAudio("+i+")' onclick='playAudio("+i+")'><img src='" + data[i].album.image + "'";
          listSongs += "style='width:45% border-radius: 100%' class='zoom' style='text-align: center;'></a></div>";
          listSongs += "<div class='col-sm-6' style='background-color:white;'>";
          listSongs += "<table><tr><td><h5>Song: " + data[i].name + "</h5></td><td style='text-align: right'>Album: " + data[i].album.name + "</td></tr>";
          listSongs += "<tr><td><h5>Artist: " + data[i].artists.name + "</h5></td><td style='text-align: right'>Duration in ms: " + data[i].duration + "</td></table>"
          listSongs += "</div><div class='col-sm-3' style='background-color:white; '>";
          listSongs += "<button onclick='checkPlaylists(this.value)' class ='like' value='" + data[i].href +"'><i id='1" + data[i].href + "'class='fas fa-plus' style='color:red; size: 10px'></i></button>";
          listSongs += "<button onclick='checkFavorites(this.value)' class ='like' value='" + data[i].href +"'><i id='" + data[i].href + "'class='fas fa-heart' style='color:red'></i></button>";
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
          listSongs += "<button onclick='checkPlaylists(this.value)' class ='like' value='" + data[i].href +"'><i id='1" + data[i].href + "'class='fas fa-plus' style='color:red; size: 10px'></i></button>";
          listSongs += "<button onclick='checkFavorites(this.value)' class ='like' value='" + data[i].href +"'><i id='" + data[i].href + "'class='fas fa-heart' style='color:red'></i></button>";
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


// Function used to print the favorites songs, needed to modify the favorites output
// on the page through deleteFrom Favorites() function
function printFavoritesPlaylists(data, sel, index) {

    listSongs = "";
    listSong = "";
    listSong += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
    listSong += "<div class='here'><h1>Your Tracks! Hover on image to listen.</h1></div><br>";
      for (i = 0; i < data.length; i++) {
        if (i %2 == 0) {
          listSongs += "<div class='row'><div class='col-sm-3' style='background-color:white;'>";
          listSongs += "<audio id='audioID"+i+"'><source src='" + data[i].preview_url + "' type='audio/mpeg'></audio>";
          listSongs += "<a href='#' onmouseenter='playAudio("+i+")'onmouseout='stopAudio("+i+")' onclick='playAudio("+i+")'><img src='" + data[i].album.image + "'";
          listSongs += "style='width:45% border-radius: 100%' class='zoom' style='text-align: center;'></a></div>";
          listSongs += "<div class='col-sm-6' style='background-color:white;'>";
          listSongs += "<table><tr><td><h5>Song: " + data[i].name + "</h5></td><td style='text-align: right'>Album: " + data[i].album.name + "</td></tr>";
          listSongs += "<tr><td><h5>Artist: " + data[i].artists.name + "</h5></td><td style='text-align: right'>Duration in ms: " + data[i].duration + "</td></table>"
          listSongs += "</div><div class='col-sm-3' style='background-color:white; '>";
          if (sel == 0) {
            listSongs += "<button onclick='checkPlaylists(this.value)' class ='like' value='" + data[i].href +"'><i id='1" + data[i].href + "'class='fas fa-plus' style='color:red; size: 10px'></i></button>";
            listSongs += "<button onclick='deleteFromFavorites(this.value)' class ='like' value='" + data[i].href +"'><i id='" + data[i].href + "'class='fas fa-heart' style='color:black'></i></button>";
          } else {
            listSongs += "<button onclick='deleteFromPlaylists(this.value)' class ='like' value='"+ index + data[i].href +"'><i id='1" + data[i].href + "'class='fas fa-plus' style='color:black; size: 10px'></i></button>";
            listSongs += "<button onclick='checkFavorites(this.value)' class ='like' value='" + data[i].href +"'><i id='" + data[i].href + "'class='fas fa-heart' style='color:red'></i></button>";
          };
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
          if (sel == 0) {
            listSongs += "<button onclick='checkPlaylists(this.value)' class ='like' value='" + data[i].href +"'><i id='1" + data[i].href + "'class='fas fa-plus' style='color:red; size: 10px'></i></button>";
            listSongs += "<button onclick='deleteFromFavorites(this.value)' class ='like' value='" + data[i].href +"'><i id='" + data[i].href + "'class='fas fa-heart' style='color:black'></i></button>";
          } else {
            listSongs += "<button onclick='deleteFromPlaylists(this.value)' class ='like' value='" + index + data[i].href +"'><i id='1" + data[i].href + "'class='fas fa-plus' style='color:black; size: 10px'></i></button>";
            listSongs += "<button onclick='checkFavorites(this.value)' class ='like' value='" + data[i].href +"'><i id='" + data[i].href + "'class='fas fa-heart' style='color:red'></i></button>";
          };
          listSongs += "<button><i class='fas fa-share' style='color: #4CAF50'></i></button>";
          listSongs += "</div></div><hr class='horizontal_line'>";
      };

    };

    listSongs += "</div></div>";
    document.getElementById("list-homepage-songs").innerHTML = listSong + listSongs;
}


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// FUNCTIONS TO CONNECT TO SPOTIFY API //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// Function to retrieve songs from new release albums
function listNewReleases() {
  
    url = "/new_release";
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.setRequestHeader('Content-type', 'text/plain');

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          data = request.responseText;
          data = JSON.parse(data);
          alert(data);
          //temp_songs = set to toal list of songs;
          //printTracksToPage(total_list of songs);
        };
    };
    request.send();
};

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
          temp_songs = data;
          printTracksToPage(data, 0);
        };
    };
    request.send();
}


// Function to find all possible info on the artists inputed into the search bar
function getArtistInfo() {
  url = '/search_artist' + "?artist=" + document.getElementById('search2').value;
    var request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.setRequestHeader('Content-type', 'text/plain');

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          data = request.responseText;
          getArtistSongs(data);
        };
    };
    request.send();
};

// Function to find all possible info on the artists inputed into the search bar
function getArtistSongs(artist_id) {
  url = '/get_artist_songs' + "?artist_id=" + artist_id;
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.setRequestHeader('Content-type', 'text/plain');
  request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        data = request.responseText;
        data = JSON.parse(data);
        temp_songs = data;
        printTracksToPage(data);
      };
  };
  request.send();
};

////////////////////////////////////////////////////////////////////////////////
//////////////////// FUNCTIONS TO WORK WITH FAVORITES //////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Function to add the song to the Favorites list
function checkFavorites(value) {
  var song;
  for(i = 0; i < temp_songs.length; i++) {
    if(temp_songs[i].href == value) {
      song = temp_songs[i];
    }
  }

  var color = document.getElementById(value).style.color;
  if (color == 'red') {
    for (i = 0; i < user_playlists[0].songs.length; i++) {
      if(user_playlists[0].songs.href == value) {
        document.getElementById(value).style.color = 'black';
        return;
      }
    }
    user_playlists[0].songs.push(song);
    document.getElementById(value).style.color = 'black';
  }
  else {
    var index;
    for (i = 0; i < user_playlists[0].songs.length; i++) {
      if(user_playlists[0].songs.href == value) {
        index = i;
      }
    }
    user_playlists[0].songs.splice(index, 1);
    document.getElementById(value).style.color = 'red';
  };
};


// Function used to display the songs in the favorites list onto the page
function showFavorites() {
  printFavoritesPlaylists(user_playlists[0].songs, 0, 0);
};

// Function used to display the songs in the favorites list onto the page
function deleteFromFavorites(value) {
  var index;
  for (i = 0; i < user_playlists[0].songs.length; i++) {
    if(user_playlists[0].songs.href == value) {
      index = i;
    }
  }
  user_playlists[0].songs.splice(index, 1);
  printFavoritesPlaylists(user_playlists[0].songs, 0, 0);
};


////////////////////////////////////////////////////////////////////////////////
//////////////////// FUNCTIONS TO WORK WITH PLAYLISTS //////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Function to retrieve and print the user playlists stored in mongoDB
function showLocalPlaylists() {
  str = "<div class='here' style='color: black'><h1 >Our Genres!</h1></div>";
  str += "<button class='table-button' onclick='createPlaylist()'>Create New Playlist</button><br><br>";
  
  if(user_playlists.length == 0) {
    document.getElementById("list-homepage-songs").innerHTML = str;
  }
  else {
    for (i = 1; i < user_playlists.length; i++) {
      str += "<div class='addedPlaylist'>";
      str += "<button class='playlist_button' value='" + user_playlists[i].name + "' onclick='getPlaylistSongs(this.value)'>" + user_playlists[i].name + "</button>";
      str += "<button style='border: none'";
      str += "class='like' value='" + user_playlists[i].name + "'onclick='deletePlaylist(this.value)'><i class='fa fa-minus' style='color:black; size: 10px'></i></button>";
      str += "</div><br>";
    };
      document.getElementById("list-homepage-songs").innerHTML = str;
  };
};


// Function used to delete a playlist with name = name
function deletePlaylist(value) {
  var index;
  for (i = 1; i < user_playlists.length; i++) {
    if(user_playlists[i].name == value) {
      index = i;
    };
  };
  user_playlists.splice(index, 1);
  showLocalPlaylists()
};


// Function to create a new user playlist
function createPlaylist() {
  var name = prompt("What do you want to call your playlist?");
  if ((name == null) || (name == "")) {
    name = "default";
  };

  var playlist = {"name": name, "songs":[]};
  user_playlists.push(playlist);
  showLocalPlaylists();
};


// Function to display all of the songs saved to the choosen user playlist
function getPlaylistSongs(value) {
  var songs = [];
  var index = 0;
  for (i = 1; i < user_playlists.length; i++) {
    if (value == user_playlists[i].name) {
      songs = user_playlists[i].name;
      index = i;
    };
  };
  printFavoritesPlaylists(songs, 1, index);
};

// Function to add the song to the choosen playlist
function checkPlaylists(value) {
  var song;
  var index;
  for(i = 0; i < temp_songs.length; i++) {
    if(temp_songs[i].href == value) {
      song = temp_songs[i];
    }
  }

  var color = document.getElementById("1" + value).style.color;
  if (color == 'red') {
    var name = prompt("Which playlist would you like to add it too?");
    /*for (i = 0; i < user_playlists[0].songs.length; i++) {
      if(user_playlists[0].songs.href == value) {
        document.getElementById(value).style.color = 'black';
        return;
      }
    }
    user_playlists[0].songs.push(song);
    document.getElementById(value).style.color = 'black'; */
  }
  else {
    alert("button is black");
    /*var index;
    for (i = 0; i < user_playlists[0].songs.length; i++) {
      if(user_playlists[0].songs.href == value) {
        index = i;
      }
    }
    user_playlists[0].songs.splice(index, 1);
    alert(JSON.stringify(song) + " was deleted");
    document.getElementById(value).style.color = 'red'; */
  };
};

function deleteFromPlaylist(value) {
  var index;
  var id = parseInt(value[0]);
  var href = value.substr(1, ((value.length) - 1));

  for (i = 0; i < user_playlists[id].songs.length; i++) {
    if(user_playlists[id].songs.href == href) {
      index = i;
    }
  }
  user_playlists[id].songs.splice(index, 1);
  printFavoritesPlaylists(user_playlists[id].songs, 1, id);

};


////////////////////////////////////////////////////////////////////////////////
//////////////////////////// EXTRA FUNCTIONS ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Function to save user data to mongoDB
function postData() {
  var to_send = user_playlists;
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
