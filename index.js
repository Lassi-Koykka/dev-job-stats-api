const express = require("express");
const path = require("path");
const fs = require("fs")
const logger = require("./middleware/logger");
const { response } = require("express");
const { spawn } = require('child_process')
const fetch = require("node-fetch");
const { time } = require("console");
const { pathToFileURL } = require("url");

const app = express();

let data = JSON.parse(fs.readFileSync("data.json"))

app.use(logger);

//app.use(express.static(path.join(__dirname, 'public')));

app.get("/api", (req, res) => {
  deliverPostings(req, res);
});

app.get("/data", (req, res) => { 
  dataToSend = data
  res.json(dataToSend)
})

app.get("/data/:key", (req, res) => {
  let key = req.params.key
  if(data[key] !== undefined) {
    res.json(data[key])
  }
});

async function deliverPostings(req, res) {

  url = `https://duunitori.fi/api/v1/jobentries?
  ${req.query.area !== undefined ? `area=${req.query.area}&` : ''}
  &search=koodari${req.query.words !== undefined ? `,${req.query.words}` : ''}
  &search_also_descr=1
  &format=json`;

    console.log(url)
  data = await fetch(url).then((response) => {
    return response.json();
  });

  results = data.results;

  while (data.next !== null) {
    data = await fetch(data.next).then((response) => {
      return response.json();
    });
    results = results.concat(data.results);
  }

  delete data.next;
  data.query = data.previous;
  delete data.previous;
  data.results = results;

  console.log(data.results.length);

  res.json(data);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
