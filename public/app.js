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

function submitMovies(movies) {

  console.log("Movies: " + movies + "\n");

  // Check that both movies were submitted properly

  // Check movie names with database

  var artistList = new LinkedList();
  var genreList = new LinkedList();
  var trackList = new LinkedList();

  // Search for movie soundtracks on Spotify (take the first result for now)
  // for (var i = 0; i < movies.length; i++) {  }
  spotifyApi.searchAlbums(movies[0] + "original motion picture soundtrack").then(function (data) {
    console.log("Searching for '" + movies[0] + "'...");
    // console.log(data.body.albums);

    var album = data.body.albums.items[0];
    console.log("Album chosen for search '" + movies[0] + "': " + album.name + " (" + album.id + ")\n");

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
        artistList.add(trackList.get(i).artists[0])
        console.log('"' + artistList.get(i).name + '"' + " added to artist list (" + artistList.get(i).id + ")");
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
            var seed_tracks = [];
            for(var k = 0; i < trackList.length; i++){
              seed_tracks.push(trackList.get(k).id);
            }

            var seed_artists = [];
            for(var k = 0; i < artistList.length; i++){
              seed_artists.push(artistList.get(k).id);
            }

            var seed_genres = [];
            for(var k = 0; i < genreList.length; i++){
              seed_albums.push(genreList.get(k).id);
            }

            var seeds = [seed_tracks, seed_artists, seed_genres];

            getReccs(seeds);
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
  // Transfer from linked lists to arrays - ADJUST THIS TO BE BUILT INTO THE LINKED LIST CLASS PLEASE
  spotifyApi.getRecommendations({
    seed_tracks: seeds[0],
    seed_artists: seeds[1],
    seed_genres: seeds[2]
  })
  .then(function(data) {
    let recommendations = data.body;
    console.log(recommendations);
  }, function(err) {
    console.log(err);
  });
}

module.exports = {
  submitMovies
}