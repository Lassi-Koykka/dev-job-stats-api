const express = require("express");
const path = require("path");
const fs = require('fs')
const bp = require('body-parser')
const { detResType } = require(path.join(__dirname, '..', '..', '..', 'src', 'detResType.js'))
const router = express.Router();


router.use(bp.urlencoded({ extended: false }));
router.use(bp.json());

let KWPath = path.join(__dirname, '..','..','..', 'keywords', 'technologies.txt')

let KWList = fs.readFileSync(KWPath).toString().split("\n");

router.route("/")
.get((req, res) => {
    res.json(KWList)
})


router.use((req, res) => {
    res.status(404);
    detResType(req, res, path.join(__dirname, '..', '..', '..', 'public', '404.html'))
})
module.exports = router;
