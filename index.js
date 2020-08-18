const express = require("express");
const path = require("path");
const cron = require('node-cron');
const util = require('util');
const makeDataKeysLower = require(path.join(__dirname, "src", "makeKeysLower.js"));
const dataExists = require(path.join(__dirname, "src", "dataExists.js"))
const {updateJsonSync,updateJson} = require(path.join(__dirname, "src", "updateJson.js"))


//MIDDLEWARE
const logger = require(path.join(__dirname, "middleware", "logger"))

//ROUTES
const api = require(path.join(__dirname, 'routes', 'api', 'api'))

//APP
const app = express();

//Run on startup
//Checks if all the json files inside the folder exist before starting the server and creates them if needed.
//Returns the data and posts objects
let {
  data,
  posts
} = dataExists()
//MIDDLEWARE
app.use(logger);


data = makeDataKeysLower(data)

app.locals.data = data
app.locals.posts = posts

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//ROUTING
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use("/api", api);

app.use((req, res) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
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
});




//Schedule cron to update the json data every 15 minutes
cron.schedule("0,15,30,44 * * * *", function () {
  console.log("SCHEDULED DATA UPDATE:")
  let async_update = util.promisify(updateJson)
  async_update().then((obj) => {
    obj.data = makeDataKeysLower(obj.data)
    if (obj.data != data) {
      console.log("Some of the data has changed!")
    }
    data = obj.data
    posts = obj.posts
    app.locals.data = data
    app.locals.posts = data
    console.log('updated')
  })
})

//Define the port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});