const express = require('express')
const path = require('path')
const { detResType } = require(path.join(__dirname, '..', '..', '..', 'src', 'detResType.js'))
const router = express.Router()


//Goes through the data object by matching request parameters and properties of nested objects
function paramSearchData(req, res) {
    var data = req.app.locals.data
    var params = []
    Object.keys(req.params).forEach((key) => {
        params.push(req.params[key])
    })
    try {
        params.forEach(param => {
            if (data[param] === undefined) {
                throw " 404: Requested data not found."
            }
            data = data[param]
        });
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(404);
        detResType(req, res, path.join(__dirname, '..', '..', '..', 'public', '404.html'))
    }
}

router.route("/")
    .get((req, res) => {
        let data = req.app.locals.data
        res.json(data)
    })

router.route("/:section").get((req, res) => paramSearchData(req, res));

router.route('/:section/:sectItem').get((req, res) => paramSearchData(req, res))

router.route('/:section/:sectItem/:itemParam1').get((req, res) => paramSearchData(req, res));

router.route('/:section/:sectItem/:itemParam1/:itemParam2').get((req, res) => paramSearchData(req, res));

router.route('/:section/:sectItem/:itemParam1/:itemParam2/:itemParam3').get((req, res) => paramSearchData(req, res));


module.exports = router