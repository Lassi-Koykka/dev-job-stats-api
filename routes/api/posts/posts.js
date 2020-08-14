const express = require('express');
var router = express.Router();

router.route('/')
    .get((req, res) => {
        let posts = req.app.locals.posts
        res.json(posts)
    })

module.exports = router