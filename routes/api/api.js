const express = require('express');
const path = require('path')

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
  
    // respond with html page
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', '..', 'public', '404.html'));
        return;
      }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

module.exports = router;