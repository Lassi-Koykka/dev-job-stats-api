const express = require("express");
const path = require("path")
const { detResType } = require(path.join(__dirname, '..', '..', '..', 'src', 'detResType.js'))
var router = express.Router();

router.route("/").get((req, res) => {
  let posts = req.app.locals.posts;
  res.json(posts);
});

router.use((req, res) => {
  res.status(404);
  detResType(req, res, path.join(__dirname, '..', '..', '..', 'public', '404.html'))
});

module.exports = router;
