
require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var writeToLog = function(data) {
  fs.appendFile("log.txt", JSON.stringify(data) + "\n", function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
};

var getArtistNames = function (artist) {
  return artist.name;
}

var getMeSpotify = function (songName) {
  if (!songName) {
    songName = "32 Weeks";
}

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function (err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;
      for (var i = 0; i < 10; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");

      }
      writeToLog(data);

    }
  );

}

var getMeMovie = function (movieName) {
  if (!movieName) {
    movieName = "My Dinner With Andre";
  }
  
    var urlQuery =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=7333d518";
  
    request(urlQuery, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      }
    });
  };
  
  var getBands = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=d181df70f029efe5fb5706bae3492a47";
  
    request(queryURL, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
  
        if (response !== 200 && error) {
          console.log("No results found for " + artist);
          return;
        }
  
        console.log("Upcoming concerts for " + artist + ":");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
  
    
          console.log(
            show.venue.city +
            "," +
            (show.venue.region || show.venue.country) +
            " at " +
            show.venue.name +
            " " +
            moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    });
  };
  
  var pickItUp = function () {
    fs.readFile("random.txt", "utf8", function (err, response) {
      if (err) throw err;
      console.log(response);
  
      var dataArr = response.split(",");
  
      if (dataArr.length === 2) {
        choose(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        choose(dataArr[0]);
      }
    });
  };
  
 
  var choose = function (caseData, functionData) {
    switch (caseData) {
      case "concert-this":
        getBands(functionData);
        break;
      case "spotify-this-song":
        getMeSpotify(functionData);
        break;
      case "movie-this":
        getMeMovie(functionData);
        break;
      case "pick-it-up":
        pickItUp();
        break;
      default:
        console.log("You stumped LIRI. I have dishonored my family.");
    }
  };
  

  var runThis = function (argOne, argTwo) {
    choose(argOne, argTwo);
  };
  

  runThis(process.argv[2], process.argv.slice(3).join(" "));