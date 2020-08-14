const express = require('express')
const fs = require('fs')
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
            res.status(404).send("<h2>404 Not found</h2>")
        }
    });

module.exports = router