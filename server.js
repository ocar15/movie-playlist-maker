var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
const fs = require('fs');
const parse = require('node-html-parser').parse;
var { submitMovies, makePlaylist } = require('./public/app.js');
const querystring = require("querystring");

const app = express()
const router = express.Router();
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '/public/main.html'));
})

let movies = []
let songList = []

// Submit movie names
router.post('/', async (req, res) => {
    // get movies
    movies = [req.body.movieOneField, req.body.movieTwoField]

    // get reccs
    songList = await submitMovies(movies);

    // parse HTML, send embed
    fs.readFile(path.join(__dirname, '/public/main.html'), 'utf8', (err, html) => {
        if (err) {
            throw err;
        }

        const root = parse(html);

        // Song names (add artists at some point)
        const embedPlaylist = root.querySelector('#embedPlaylist');
        embedPlaylist.set_content(`<h4><a href="${songList[0].external_urls.spotify}">${songList[0].name}<a></h4><br>
        <h4><a href="${songList[1].external_urls.spotify}" target=”_blank”>${songList[1].name}<a></h4><br>
        <h4><a href="${songList[2].external_urls.spotify}" target=”_blank”>${songList[2].name}<a></h4><br>
        <h4><a href="${songList[3].external_urls.spotify}" target=”_blank”>${songList[3].name}<a></h4><br>
        <h4><a href="${songList[4].external_urls.spotify}" target=”_blank”>${songList[4].name}<a></h4><br>
        <h4><a href="${songList[5].external_urls.spotify}" target=”_blank”>${songList[5].name}<a></h4><br>
        <h4><a href="${songList[6].external_urls.spotify}" target=”_blank”>${songList[6].name}<a></h4><br>
        <h4><a href="${songList[7].external_urls.spotify}" target=”_blank”>${songList[7].name}<a></h4><br>
        <h4><a href="${songList[8].external_urls.spotify}" target=”_blank”>${songList[8].name}<a></h4><br>
        <h4><a href="${songList[9].external_urls.spotify}" target=”_blank”>${songList[9].name}<a></h4><br>`);

        // Save to Spotify button
        const saveButton = root.querySelector('#saveButton');
        saveButton.set_content("<input type='submit' id='saveButton' name='Save' />");

        res.send(root.toString());

        console.log("\nRecommendations sent to user.")
    });
})

// Login
router.post('/save', async (req, res) => {

    console.log("\nUser has chosen to save playlist. Prompting login...")

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: '0037f498f24f4c5786db8948c2db3d5b',
            scope: 'playlist-modify-private',
            redirect_uri: 'http://localhost:3000/callback/'
        }))
});

router.get('/callback/', async (req, res) => {
    const authCode = req.query.code;

    console.log("Login complete. authCode = " + authCode.substring(0, 20) + "...");
    await makePlaylist(authCode, movies[0], movies[1], songList);
    
})

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})