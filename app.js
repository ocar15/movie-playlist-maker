const SpotifyWebApi = require('spotify-web-api-node');

// https://developer.spotify.com/dashboard/applications

require("dotenv").config();
const spotifyApi = new SpotifyWebApi({
  clientId: '2332c3ac081e420499643a4648c2170c',
  clientSecret: process.env.MYAPIKEY
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    // Get Elvis' albums
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
      function (data) {
        console.log('Artist albums', data.body);
      },
      function (err) {
        console.error(err);
      }
    );
  },
  function (err) {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  }
);

function submitMovies() {
  // Take movie names from text fields
  var movieOneName = document.getElementById('movieOneField').value
  var movieTwoName = document.getElementById('movieTwoField').value
  var movieThreeName = document.getElementById('movieThreeField').value

  console.log(movieOneName + ", " + movieTwoName + ", " + movieThreeName);

  // Check movie names with database

  // Search for movie soundtracks on Spotify

  // Obtain top 5 movie soundtrack genres

  // Search for top songs by genres, take two from each search

  // Put songs in playlist, embed it
}

module.exports = { submitMovies };