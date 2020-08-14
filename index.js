const express = require("express");
const path = require("path");
const fs = require("fs")
const dataExists = require("./src/dataExists.js");
const updateJson = require("./src/updateJson.js")


//MIDDLEWARE
const logger = require("./middleware/logger");

//ROUTES
const api = require(path.join(__dirname, 'routes', 'api', 'api'))

//APP
const app = express();

//Run on startup
//Checks if all the json files inside the folder exist before starting the server and creates them if needed.
//Returns the data and posts objects
let { data, posts } = dataExists()

//MIDDLEWARE
app.use(logger);

app.locals.data = data
app.locals.posts = posts

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//ROUTING
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use("/api", api);

//Define the port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});