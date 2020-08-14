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
            res.status(404).sendFile(path.join(__dirname, '..', '..', '..', 'public', '404.html'))
        }
    });

module.exports = router