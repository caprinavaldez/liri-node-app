var keys = require("./keys.js"); //grabs keys from keys.js file
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var command = process.argv[2];
var item = process.argv[3];
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);
var request = require('request');
var fs = require("fs");

//tweets
function myTweets() {
	var params = {
		screen_name: 'MrsCapreezy',
		count: 20
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log("\nGIVE ME MY TWEETS!\n");
	    
	    for (var i = 0; i < tweets.length; i++) {	    
	    console.log("My Tweet: " + tweets[i].text + 
	    	"\nDate Created: " + tweets[i].created_at + "\n");
	  	}
	  }
	});
};

//spotify 
function spotifySearch() {
  if (item === undefined) {
	spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: 5 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  };
	  console.log("\nTitle: " + data.tracks.items[0].name + 
		"\nArtist: " + data.tracks.items[0].artists[0].name +
		"\nAlbum: " + data.tracks.items[0].album.name +
		"\nPreview Link: " + data.tracks.items[0].external_urls.spotify); 
	  });	
  } else {	
	spotify.search({ type: 'track', query: item, limit: 5 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  };
	  console.log("\nTitle: " + data.tracks.items[0].name + 
		"\nArtist: " + data.tracks.items[0].artists[0].name +
		"\nAlbum: " + data.tracks.items[0].album.name + 
		"\nPreview Link: " + data.tracks.items[0].external_urls.spotify); 
  	  });
  }
};

//request omdb
function requestMovie() {
	if (item === undefined) {
		request('http://www.omdbapi.com/?apikey=trilogy&y=&plot=short&t=' + 'Mr Nobody', function (error, response, body) {
		  	var data = JSON.parse(body);	
		  	if (!error && response.statusCode === 200) {
		  		console.log("\nTitle: " + data.Title +
		  			"\nYear: " + data.Year +
		  			"\nIMDB Rating: " + data.imdbRating +
		  			"\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
		  			"\nCountry: " + data.Country +
		  			"\nLanguage: " + data.Language +
		  			"\nActors: " + data.Actors +
		  			"\nPlot: " + data.Plot);
			};
		});
	} else {
		request('http://www.omdbapi.com/?apikey=trilogy&y=&plot=short&t=' + item, function (error, response, body) {
		  	var data = JSON.parse(body);	
		  	if (!error && response.statusCode === 200) {
		  		console.log("\nTitle: " + data.Title +
		  			"\nYear: " + data.Year +
		  			"\nIMDB Rating: " + data.imdbRating +
		  			"\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
		  			"\nCountry: " + data.Country +
		  			"\nLanguage: " + data.Language +
		  			"\nActors: " + data.Actors + 
		  			"\nPlot: " + data.Plot);
			};
		});
	};
};

//do what it says
function doWhatItSays() {
	// reads from the "random.txt" file.
	fs.readFile("random.txt", "utf8", function(error, data) {

	  if (error) {
	    return console.log(error);
	  }
 
	  console.log(data);

	  // split by comma
	  var dataArr = data.split(",");

	  if (dataArr[0] === 'spotify-this-song') {
	  	var item = dataArr[1];
	  	spotify.search({ type: 'track', query: item, limit: 5 }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  };
		  console.log("\nTitle: " + data.tracks.items[0].name +
			"\nArtist: " + data.tracks.items[0].artists[0].name +
			"\nAlbum: " + data.tracks.items[0].album.name +
			"\nPreview Link: " + data.tracks.items[0].external_urls.spotify); 
	    });
	  }
	
	  if (dataArr[0] === 'movie-this') {
		var item = dataArr[1];
		request('http://www.omdbapi.com/?apikey=trilogy&y=&plot=short&t=' + item, function (error, response, body) {
		  	var data = JSON.parse(body);	
		  	if (!error && response.statusCode === 200) {
		  		console.log("\nTitle: " + data.Title +
		  			"\nYear: " + data.Year +
		  			"\nIMDB Rating: " + data.imdbRating +
		  			"\nRotten Tomatoes Rating: " + data.Ratings[1].Value +
		  			"\nCountry: " + data.Country + 
		  			"\nLanguage: " + data.Language +
		  			"\nActors: " + data.Actors + 
		  			"\nPlot: " + data.Plot);
			};
		});
	  };

	  if (dataArr[0] === 'my-tweets') {
		myTweets();	  	  	
	  };
	});
};

//commands
if (command === "my-tweets") {
	myTweets();
} else if (command === "spotify-this-song") {
	spotifySearch();
} else if (command === "movie-this") {
	requestMovie();
} else if (command === "do-what-it-says") {
	doWhatItSays()
} else {
	console.log("Not a valid command!")
}