const express = require('express');
const path = require('path')
const { detResType } = require(path.join(__dirname, '..', '..', 'src', 'detResType.js'))


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

router.use((req, res) => {
    res.status(404);
    detResType(req, res, path.join(__dirname, '..', '..', 'public', '404.html'))
  });

module.exports = router;