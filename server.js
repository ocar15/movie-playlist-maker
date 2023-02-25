var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
const fs = require('fs');
const parse = require('node-html-parser').parse;
var { submitMovies } = require('./public/app.js');

const app = express()
const router = express.Router();
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Submit movie names
router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '/public/main.html'));
})
router.post('/', async (req, res) => {
    // get movies
    const movies = [req.body.movieOneField, req.body.movieTwoField]

    // get reccs
    const songList = await submitMovies(movies);

    // parse HTML, send embed
    fs.readFile(path.join(__dirname, '/public/main.html'), 'utf8', (err, html) => {
        if (err) {
            throw err;
        }

        const root = parse(html);

        const body = root.querySelector('#embedPlaylist');
        body.set_content(`<h4><a href="${songList[0].external_urls.spotify}">${songList[0].name}<a></h4><br>
        <h4><a href="${songList[1].external_urls.spotify}" target=”_blank”>${songList[1].name}<a></h4><br>
        <h4><a href="${songList[2].external_urls.spotify}" target=”_blank”>${songList[2].name}<a></h4><br>
        <h4><a href="${songList[3].external_urls.spotify}" target=”_blank”>${songList[3].name}<a></h4><br>
        <h4><a href="${songList[4].external_urls.spotify}" target=”_blank”>${songList[4].name}<a></h4><br>
        <h4><a href="${songList[5].external_urls.spotify}" target=”_blank”>${songList[5].name}<a></h4><br>
        <h4><a href="${songList[6].external_urls.spotify}" target=”_blank”>${songList[6].name}<a></h4><br>
        <h4><a href="${songList[7].external_urls.spotify}" target=”_blank”>${songList[7].name}<a></h4><br>
        <h4><a href="${songList[8].external_urls.spotify}" target=”_blank”>${songList[8].name}<a></h4><br>
        <h4><a href="${songList[9].external_urls.spotify}" target=”_blank”>${songList[9].name}<a></h4><br>`);
        res.send(root.toString());
    });
})

// Return stuff to site

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})