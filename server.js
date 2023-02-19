var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
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
    const movies = [req.body.movieOneField, req.body.movieTwoField]
    const songList = await submitMovies(movies);
    res.send({songList: songList});
})

// Return stuff to site

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})