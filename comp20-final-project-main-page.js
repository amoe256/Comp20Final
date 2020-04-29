 data = {
                "genre" : "pop",
                "image" : "Bruno.jpg",
                "song" : "moon",
                "album" : "YOYO",
                "duration" : "1:40",
      };



// This function writes anything on the right part/display
// image part of the page. The data array is from other 
// functions from the MongoDB functions. Therfore, it can also
// be considered as a print function.
function printToPage() {
    listSongs = "";
    listSongs += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
    listSongs += "<div class='here'><h1 >Your " + data.genre + "Tracks!</h1></div><br>";
      for (i = 0; i < 10; i++) {
        listSongs += "<div class='row'><div class='col-sm-3' style='background-color:white;'>";
        listSongs += "<img src='" + data.image + "' style='width:45% border-radius: 100%' class='zoom' style='text-align: center;'></div>";
        listSongs += "<div class='col-sm-6' style='background-color:white;'>";
        listSongs += "<table><tr><td><h5>Song: " + data.song + "</h5></td><td style='text-align: right'>Album: " + data.album + "</td></tr>";
        listSongs += "<tr><td><h5>Artist: " + data.artist + "</h5></td><td style='text-align: right'>Duration: " + data.duration + "</td></table>"
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
    for (i = 0; i <  8; i++) {
      playLists += "<button class='playlist' onclick='loadDataFromDatabase2Page()'>Playlist1</button><br><br>";
  }
    document.getElementById("playlist").innerHTML = playLists;
}

function listGenreFromDatabase(){
  genre = { "name" : "HipHop"};
  genreName = "";
  listTheGenre = "";
  listTheGenre += "<div class='split right'><div class='centered' style='text-decoration-color: black'>";
  listTheGenre += "<div class='here' style='color: black'><h1 >Our Genres!</h1></div>";
  genreName +="<div class='table-shadow'><table>";
  for (i = 0; i < 30; i++) {
  genreName += "<tr><td><a href='#'>" + genre.name + "</a>";
  genreName += "</td><td><a href='#'>"+ genre.name + "</a>";
  genreName += "</td><td><a href='#'>"+ genre.name + "</a></td></tr>";
}
genreName += "</table></div>";
document.getElementById("list-homepage-songs").innerHTML = listTheGenre + genreName;  
}