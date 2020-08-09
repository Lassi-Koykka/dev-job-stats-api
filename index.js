const express = require("express");
const path = require("path");
const logger = require("./middleware/logger");
const { response } = require("express");
const { spawn } = require('child_process')
const fetch = require("node-fetch");
const { time } = require("console");

const app = express();

app.use(logger);

//app.use(express.static(path.join(__dirname, 'public')));

app.get("/api", (req, res) => {
  deliverPostings(req, res);
});

app.get("/desc", (req, res) => {
  
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn('python3', ['./python/analyze.py'])
  // collect data from script
  python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
  console.log(data)
  dataToSend = JSON.parse(data).parse;
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
  // send data to browser
  res.json(dataToSend)
  });
})

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
