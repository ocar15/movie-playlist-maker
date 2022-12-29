// const express = require('express')
import express from 'express';
import path from 'path';
import url from 'url';

const app = express()
const port = 3000
// const path = require('path')

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'))

app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.sendFile(path.join(__dirname, '/public/main.html'));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})