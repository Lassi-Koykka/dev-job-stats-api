const express = require("express");
const path = require("path");
const fs = require("fs")
const logger = require("./middleware/logger");
const { response } = require("express");
const { spawn } = require('child_process')
const fetch = require("node-fetch");
const { time, Console } = require("console");
const { pathToFileURL } = require("url");

const app = express();

let data

if(fs.existsSync('data.json')) {
  data = JSON.parse(fs.readFileSync("data.json"))
} else {
  data = updateData()
}

async function updateData() {
  const python = spawn(path.join(__dirname, 'python', 'venv', 'bin', 'python3'), [path.join(__dirname, 'python', 'getData.py')])
  console.log("--PYTHON OUTPUT:--")

  python.stdout.on('data', function (data) {
    console.log(data.toString())
  });
  
  python.on('close', (code) => {
    console.log("--END OF PYTHON OUTPUT--")
    console.log(`child process close all stdio with code ${code}`);
    if (code === 0) {
      return JSON.parse(fs.readFileSync("data.json"))
    } else {
      console.log("ERROR: An error occurred while updating data!")
    }
    });
}



app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get("/data/update", (req, res) => {
  res.send("Updating data...")
  data = updateData()
})

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
  } else {
    res.status(404).send("<h2>404 Not found</h2>")
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
