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
    console.log('The access token is ' + data.body['access_token']);

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

function submitMovies(movies) {
  console.log("movies in the submitMovies function...")
  console.log(movies)

  // Check that both movies were submitted properly

  // Check movie names with database

  var artists = new LinkedList();
  var genres = new LinkedList();
  var tracks = new LinkedList();

  // Search for movie soundtracks on Spotify (take the first result for now)
  // for (var i = 0; i < movies.length; i++) {  }
  spotifyApi.searchAlbums(movies[0]).then(function (data) {
    console.log('Searching for ' + movies[0]);
    // console.log(data.body.albums);

    var album = data.body.albums.items[0];
    console.log("album chosen for '" + movies[0] + "': " + album.name + " (" + album.id + ")");

    // Based on albums, get tracks (5 per movie)
    spotifyApi.getAlbumTracks(album.id, { limit : 5}).then(function(data) {
      console.log("Tracks listed: " + data.body.items.length);
      for(var i = 0; i < data.body.items.length; i++){
        tracks.add(data.body.items[i]);
        console.log('"' + tracks.get(i).name + '"' + " added to artist list (" + tracks.get(i).id + ")");
      }
    }, function(err) {
      console.log(err);
    });

     // Based on tracks, get artists - CURRENTLY PULLING FROM ALBUM
    console.log("Artists listed: " + album.artists.length);
    for(var i = 0; i < album.artists.length; i++){
      artists.add(album.artists[i])
      console.log('"' + artists.get(i).name + '"' + " added to artist list (" + artists.get(i).id + ")");
    }

    // Based on artists, get genres
    for(var i = 0; i < artists.size; i++){
      spotifyApi.getArtist(artists.get(i).id).then(function(data) {
        console.log('Genres listed: ', data.body.genres.length);
        for(var j = 0; j < data.body.genres.length; j++){
          genres.add(data.body.genres[j]);
          console.log('"' + genres.get(j) + '"' + " added to genre list");
        }
      }, function(err) {
        console.error(err);
      });
    }
   
    // Get recommendations using seeds
  }, function (err) {
    console.error(err);
  });



  // Obtain top 5 movie soundtrack genres

  // Search for top songs by genres, take two from each search

  // Put songs in playlist, embed it
}

module.exports = {
  submitMovies
}