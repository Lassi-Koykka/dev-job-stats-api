const express = require('express')
const path = require('path')
const router = express.Router()

router.route("/")
    .get((req, res) => {
        let data = req.app.locals.data
        res.json(data)
    })

router.route("/:key")
    .get((req, res) => {
        let data = req.app.locals.data
        let key = req.params.key
        if (data[key] !== undefined) {
            res.json(data[key])
        } else {
            res.status(404);
            
            // respond with html page
            if (req.accepts('html')) {
              res.sendFile(path.join(__dirname, '..', '..', '..', 'public', '404.html'));
              return;
            }
          
            // respond with json
            if (req.accepts('json')) {
              res.send({ error: 'Not found' });
              return;
            }
          
            // default to plain-text. send()
            res.type('txt').send('Not found');
        }
    });

module.exports = router