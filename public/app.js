import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';
dotenv.config()

// https://developer.spotify.com/dashboard/applications


var spotifyApi = new SpotifyWebApi({
  clientId: '2332c3ac081e420499643a4648c2170c',
  clientSecret: process.env.MYAPIKEY
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log('The access token expires in ' + data.body['expires_in']);
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

document.getElementById("submitButton").addEventListener("click", () => console.log("click"));

function submitMovies() {
  // Take movie names from text fields
  var movieOneName = document.getElementById('movieOneField').value
  var movieTwoName = document.getElementById('movieTwoField').value
  var movieThreeName = document.getElementById('movieThreeField').value

  console.log(movieOneName + ", " + movieTwoName + ", " + movieThreeName);

  // Check movie names with database

  // Search for movie soundtracks on Spotify
  spotifyApi.searchAlbums(movieOneName).then(function (data) {
    console.log('Searching for ' + movieOneName, data.body);
  }, function (err) {
    console.error(err);
  });

  // Obtain top 5 movie soundtrack genres

  // Search for top songs by genres, take two from each search

  // Put songs in playlist, embed it
}

