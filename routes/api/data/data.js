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
            let dataToSend = data[key]
        
        if ( parseInt(req.query.sort) === 1 ){
            dataToSend = sort(data[key])
        }
        else if ( parseInt(req.query.sort) === 0 ){
            dataToSend = reverse(sort(data[key]))
        }

        res.json(dataToSend)

        } else {
            res.status(404);

            // respond with html page
            if (req.accepts('html')) {
                res.sendFile(path.join(__dirname, '..', '..', '..', 'public', '404.html'));
                return;
            }

            // respond with json
            if (req.accepts('json')) {
                res.send({
                    error: 'Not found'
                });
                return;
            }

            // default to plain-text. send()
            res.type('txt').send('Not found');
        }
    });

router.route('/:key/:item').get((req, res) => {
    let data = req.app.locals.data
    let key = req.params.key
    let item = req.params.item
    if (data[key] !== undefined && data[key][item] !== undefined) {
        let dataToSend = data[key][item]
        
        if ( parseInt(req.query.sort) === 1 ){
            dataToSend = sort(data[key][item])
        }
        else if ( parseInt(req.query.sort) === 0 ){
            dataToSend = reverse(sort(data[key][item]))
        }

        res.json(dataToSend)
        
    } else {
        res.status(404);

            // respond with html page
            if (req.accepts('html')) {
                res.sendFile(path.join(__dirname, '..', '..', '..', 'public', '404.html'));
                return;
            }

            // respond with json
            if (req.accepts('json')) {
                res.send({
                    error: 'Not found'
                });
                return;
            }

            // default to plain-text. send()
            res.type('txt').send('Not found');
    }
})

module.exports = router