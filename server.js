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
        body.set_content(`<h4>${songList[0]}</h4>
                          <h4>${songList[1]}</h4>
                          <h4>${songList[2]}</h4>
                          <h4>${songList[3]}</h4>
                          <h4>${songList[4]}</h4>
                          <h4>${songList[5]}</h4>
                          <h4>${songList[6]}</h4>
                          <h4>${songList[7]}</h4>
                          <h4>${songList[8]}</h4>
                          <h4>${songList[9]}</h4>`);
        res.send(root.toString());
    });
})

// Return stuff to site

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})