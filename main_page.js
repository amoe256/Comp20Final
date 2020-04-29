/*
var data_track = {
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
*/

// This function writes anything on the right part/display
// image part of the page. The data array is from other 
// functions from the MongoDB functions. Therfore, it can also
// be considered as a print function.
function printToPage(data) {
    listSongs = "";
    listSongs += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
    listSongs += "<div class='here'><h1 >Your Tracks!</h1></div><br>";
      for (i = 0; i < data.length; i++) {
        listSongs += "<div class='row'><div class='col-sm-3' style='background-color:white;'>";
        listSongs += "<img src='" + data[i].album.image + "' style='width:45% border-radius: 100%' class='zoom' style='text-align: center;'></div>";
        listSongs += "<div class='col-sm-6' style='background-color:white;'>";
        listSongs += "<table><tr><td><h5>Song: " + data[i].name + "</h5></td><td style='text-align: right'>Artist: " + data[i].artists.name + "</td></tr>";
        listSongs += "<tr><td><h5>Album: " + data[i].album.name + "</h5></td><td style='text-align: right'>Duration in ms: " + data[i].duration + "</td></table>"
        listSongs += "</div><div class='col-sm-3' style='background-color:white; '>";
        listSongs += "<button><i class='fas fa-plus' style='color: #4842A1; size: 10px;''></i></button>";
        listSongs += "<button onclick='onesha()'' class ='like'><i class='fas fa-heart' style='color:red'></i></i></button>";
        listSongs += "<button><i class='fas fa-share' style='color: #4CAF50'></i></button>";
        listSongs += "</div></div><hr class='horizontal_line'>";
      }
    listSongs += "</div></div>";
    document.getElementById("list-homepage-songs").innerHTML = listSongs;
}


// Name: listPlayLists();
// Inputs: None for now, but it should get inputs from the querystring;
// Ouputs: None;
// Does: Lists all genres in the data base.
function listPlayLists() {

  playLists = "";
  playLists += "<p style='text-align: center; font-size: 22px'> Your Playlist </p>";
    for (i = 0; i <  8; i++) {
      playLists += "<button class='playlist' onclick='loadDataFromDatabase2Page()'>Playlist1</button><br><br>";
  }
    document.getElementById("playlist").innerHTML = playLists;
}

function listGenreFromDatabase(){

  var request = new XMLHttpRequest();
  request.open("GET", '/get_genres', true);
  request.setRequestHeader('Content-type', 'application/text');

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var genre = JSON.parse(request.responseText);
      genre = genre.genres;
      genreName = "";
      listTheGenre = "";
      listTheGenre += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
      listTheGenre += "<div class='here' style='color: black'><h1 >Our Genres!</h1></div>";
      genreName +="<div class='table-shadow'><table>";
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


function postData() {
  var to_send = [
          {artist: 'Bruno Mars', song:'When I was your man'},
          {artist: 'Bruno Mars', song:'Talking to the Moon'}
      ];
  to_send = JSON.stringify(to_send);
  url = "/post";

  var request = new XMLHttpRequest();
  request.open("POST", url, true);

  request.setRequestHeader('Content-type', 'application/json');

  request.onreadystatechange = function() {
  if (request.readyState == 4 && request.status == 200) {
              document.getElementById('page_two').style.display = 'none';
              document.getElementById('page_three').style.display = 'block';
  };
};
request.send(to_send);

};

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


function getTracks(value) {
    url = "/get_genre_artists" + "?genre=" + value;

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.setRequestHeader('Content-type', 'text/plain');

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          data = request.responseText;
          data = JSON.parse(data);
          printToPage(data);
        };
    };
    request.send();
}

function getArtist(data) {
  alert(data);
    //alert(data[i]);
    /*
    url = "/get_track" + data[i].href;

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.setRequestHeader('Content-type', 'application/text');

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          getFullTrack(request.responseText);
        };
    };
    request.send();*/
};
