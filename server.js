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
router.post('/', (req, res) => {
    // console.log('submitting a form...')
    // console.log("request", req.body)
    const movies = [req.body.movieOneField, req.body.movieTwoField]
    submitMovies(movies)
})

// Return stuff to site

app.use('/', router);

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})