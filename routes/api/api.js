const express = require('express');
var router = express.Router();
const dataRoute = require('./data/data.js');
const postsRoute = require('./posts/posts.js');
const kwRoute = require('./keywords/keywords.js')

router.route('/')
    .get((req, res) => {
        res.send('WELCOME TO THE API PAGE')
    })

router.use('/data', dataRoute)

router.use('/posts', postsRoute)

router.use('/keywords', kwRoute)

module.exports = router;