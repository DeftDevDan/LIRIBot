var keys = require("./keys.js");

var args = process.argv;

start(args[2]);

function start(x) {
	switch (x) {
		case "my-tweets":
			tweet();
			break;
		case "spotify-this-song":
			spotify();
			break;
		case "movie-this":
			movie();
			break;
		case "do-what-it-says":
			doSomething();
			break;
	}	
}



function tweet() {
	var Twitter = require("twitter");

	console.log(keys.twitterKeys);

	var client = new Twitter(keys.twitterKeys);

	var params = {
		screen_name: 'kptkid',
		count: '20'
	}

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) {
			console.log(error);
		}

		for(var tweet in tweets) {
			console.log(tweets[tweet].text + " @: " + tweets[tweet].created_at);
		}
	});
}

function spotify() {
	var spotify = require('spotify');
	var song = "";
	if(args.length > 3) {
		for(var i = 3; i < args.length; i++) {
			song = song + " " + args[i];
		}
		spotify.search({type: 'track', query: song }, function(err, data){
			if(err) {
				console.log(err);
			}
			console.log(data.tracks.items[0].artists[0].name);
			console.log(data.tracks.items[0].name);
			console.log(data.tracks.items[0].preview_url);
			console.log(data.tracks.items[0].album.name);
		});
	} else {
		song = "The Sign";
		spotify.search({type: 'track', query: song }, function(err, data){
			if(err) {
				console.log(err);
			}
			console.log(data.tracks.items[2].artists[0].name);
			console.log(data.tracks.items[2].name);
			console.log(data.tracks.items[2].preview_url);
			console.log(data.tracks.items[2].album.name);
		});
	}
}

function movie() {
	var request = require("request");
	var search = "";
	if(args.length > 3) {
		for(var i = 3; i < args.length; i++) {
			search += " " + args[i];
		}
	} else {
		search = "Mr. Nobody";
	}


	var url="http://www.omdbapi.com/?t=" + search + "&y=&plot=short&r=json";

	request(url, function(err, response, data) {
		if(err) {
			console.log(err);
		} else {
			var movie = JSON.parse(data);
			var tomato = -1;
			console.log(movie.Title);
			console.log(movie.Year);
			console.log(movie.imdbRating);
			console.log(movie.Country);
			console.log(movie.Language);
			console.log(movie.Plot);
			console.log(movie.Actors);
			for(var rt in movie.Ratings) {
				if (movie.Ratings[rt].Source === 'Rotten Tomatoes') {
					tomato = rt;
				}
			}
			if(tomato === -1) {
				console.log("No Rotten Tomatoes Rating");
			} else {
				console.log(movie.Ratings[tomato].Value);
			}
			console.log("https://www.rottentomatoes.com/m/" + movie.Title.replace(/ |\. |, |: /g, "_"));
		}
	});
}

function doSomething() {
	var fs = require('fs');

	fs.readFile('random.txt', 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		}
		args = [ "", ""]
		data = data.split(",");

		for(var i = 0; i < data.length; i++) {
			args.push(data[i].trim());
		}
		
		start(args[2])
	});
}