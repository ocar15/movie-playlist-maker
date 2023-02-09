var SpotifyWebApi = require('spotify-web-api-node')
var { Node, LinkedList} = require('./classes.js');
var dotenv = require('dotenv')
dotenv.config()

// https://developer.spotify.com/dashboard/applications
// https://github.com/thelinmichael/spotify-web-api-node

var spotifyApi = new SpotifyWebApi({
  clientId: '2332c3ac081e420499643a4648c2170c',
  clientSecret: process.env.MYAPIKEY
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    // console.log('The access token expires in ' + data.body['expires_in']);
    console.log('Access token: ' + data.body['access_token'] + "\n");

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  }
);

async function submitMovies(movies){
  getSeeds(movies[0]);
  console.log("This should be LAST");
}

function getSeeds(movie) {
  console.log("Movie: " + movie + "\n");

  // Check that both movies were submitted properly

  // Check movie names with database

  var artistList = new LinkedList();
  var genreList = new LinkedList();
  var trackList = new LinkedList();

  // Search for movie soundtracks on Spotify (take the first result for now)
  // for (var i = 0; i < movies.length; i++) {  }
  spotifyApi.searchAlbums(movie + " original motion picture soundtrack").then(function (data) {
    console.log("Searching for '" + movie + "'...");
    // console.log(data.body.albums.items);

    var album = data.body.albums.items[0];
    console.log("Album chosen for search '" + movie + "': " + album.name + " (" + album.id + ")\n");

    // Based on albums, get tracks (5 per movie)
    spotifyApi.getAlbumTracks(album.id, {limit: 5}).then(async function(data) {
      console.log("Getting tracks...");
      for(var i = 0; i < data.body.items.length; i++){
        trackList.add(data.body.items[i]);
        console.log('"' + trackList.get(i).name + '"' + " added to tracks list (" + trackList.get(i).id + ")");
      }

      // Based on tracks, get artists
      console.log("\nGettings artists...");
      for(var i = 0; i < trackList.size; i++){
        var repeat = false;
        for(var k = 0; k < artistList.size; k++){
          if(artistList.get(k).id === trackList.get(i).artists[0].id){
            var repeat = true;
          }
        }
        if(!repeat){
          artistList.add(trackList.get(i).artists[0])
          console.log('"' + artistList.get(i).name + '"' + " added to artist list (" + artistList.get(i).id + ")");
        }
      }

      // Based on artists, get genres
      console.log("\nGetting genres...");
      for(var i = 0; i < artistList.size; i++){
        await spotifyApi.getArtist(artistList.get(i).id).then(function(data) {
          for(var j = 0; j < data.body.genres.length; j++){
            genreList.add(data.body.genres[j]);
          }
          console.log(data.body.genres.length + " genres added to list (including repeats)");

          // On the final loop, get the reccomendations
          // Check if current artist's name matches the artistList tail's name
          if(data.body.name == artistList.tail.data.name){
            console.log("\nGetting recommendations...")

            // Transfer genres from linked list to string - ADJUST THIS TO BE BUILT INTO THE LINKED LIST CLASS PLEASE
            var seed_genres = "";
            for (var k = 0; k < 5 && k < genreList.size; k++) {
              seed_genres = seed_genres.concat(genreList.get(k) + ",");
            }

            var seeds = [seed_genres];

            getReccs(seeds)
          }

        }, function(err) {
          console.error(err);
        });
        
      }
      
      // End get genres

      }, function(err) {
        console.log(err);
      });
      // End get tracks


    }, function (err) {
      console.error(err);
    });
  }

function getReccs(seeds){
  console.log(seeds[0]);

  spotifyApi.getRecommendations({
    seed_genres: seeds[0],
    limit: 5
  })
  .then(function(data) {
    // console.log(data.body);
    let recommendations = data.body.tracks;

    console.log("\nRecommended songs...")
    for(var i = 0; i < recommendations.length; i++){
      console.log(recommendations[i].name);
    }
  }, function(err) {
    console.log(err);
  });
}

module.exports = {
  submitMovies
}