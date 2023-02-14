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
  // Get seeds for movies 1 and 2
  // seeds[0] is the artist, seeds[1] is the genre
  var seeds1 = await getSeeds(movies[0]);
  var seeds2 = await getSeeds(movies[1]);

  // Combine, format
  var finalArtists = [seeds1[0], seeds2[0]];
  console.log(`\nFINAL ARTISTS: ${finalArtists}`)

  var finalGenres = `${seeds1[1]},${seeds2[1]}`;
  console.log(`FINAL GENRES: ${finalGenres}`);

  const reccs = await getReccs([finalArtists, finalGenres]);

  // console.log(data.body);
  let recommendations = reccs.body.tracks;

  console.log("\nRECOMMENDATIONS:")
  // console.log(recommendations);
  // Print out each name
  for(var i = 0; i < recommendations.length; i++){
    console.log(recommendations[i].name);
  }
}

async function getSeeds(movie){
  var artistList = new LinkedList();
  var trackList = new LinkedList();

  const albums = await getAlbum(movie);

  const album = albums.body.albums.items[0];

  const tracks = await getTracks(album);

  console.log("Getting tracks...");
  for(var i = 0; i < tracks.body.items.length; i++){
    trackList.add(tracks.body.items[i]);
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

  const genreList = await getGenres(tracks, artistList); // you may be able to just delete tracks here, and only pass in the artistList

  // Transfer stuff to stuff
  
  return [artistList.get(0).id, genreList.get(0)];
}

async function getAlbum(movie) {
  console.log("Movie: " + movie + "\n");

  return spotifyApi.searchAlbums(movie + " original motion picture soundtrack")
}

async function getGenres(_tracks, artistList) {
    var genreList = new LinkedList();
    
    console.log("\nGetting genres...")
    for(var i = 0; i < artistList.size; i++){
    //   ********** THIRD CALL TO SPOTIFY API **********
    await spotifyApi.getArtist(artistList.get(i).id).then(function(data) {
        for(var j = 0; j < data.body.genres.length; j++){
        genreList.add(data.body.genres[j]);
        console.log(genreList.get(j) + " added to genre list (potential repeat)");
        }
    })
  }
  return genreList;
}

// Based on albums, get tracks (5 per movie)
// ********** SECOND CALL TO SPOTIFY API **********
async function getTracks(album) {
    return spotifyApi.getAlbumTracks(album.id, {limit: 5})
}

async function getReccs(seeds){
 return spotifyApi.getRecommendations({
    seed_artists: seeds[0],
    seed_genres: seeds[1],
    limit: 10
  })
}

module.exports = {
  submitMovies
}