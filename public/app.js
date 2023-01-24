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

  var artists = [];
  var genres = [];
  var tracks = [];

  // Search for movie soundtracks on Spotify (take the first result for now)
  // for (var i = 0; i < movies.length; i++) {  }
  spotifyApi.searchAlbums(movies[0]).then(function (data) {
    console.log('Searching for ' + movies[0]);
    // console.log(data.body.albums);

    var topAlbum = data.body.albums.items[0];
    console.log("album chosen for '" + movies[0] + "': " + topAlbum.name + " (" + topAlbum.id + ")");
    console.log("artist chosen:" + topAlbum.artists[0].name);
    console.log(topAlbum.artists[0].id);

    spotifyApi.getArtist(topAlbum.artists[0].id)
      .then(function (data) {
        console.log('Artist information', data.body);
      }, function (err) {
        console.error(err);
      });

      groceries = new LinkedList();
      groceries.add("milk");
      groceries.add("eggs");
      groceries.add("cheese")
      console.log(groceries.size);
      console.log(groceries.get(0));

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