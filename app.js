const SpotifyWebApi = require('spotify-web-api-node');

/**
 * This example retrieves an access token using the Client Credentials Flow, documented at:
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
 */

/**
 * Get the credentials from Spotify's Dashboard page.
 * https://developer.spotify.com/dashboard/applications
 */
const spotifyApi = new SpotifyWebApi({
  clientId: '2332c3ac081e420499643a4648c2170c',
  clientSecret: 'buhguh'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  }
);

// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    function(data) {
      console.log('Artist albums', data.body);
    },
    function(err) {
      console.error(err);
    }
  );