const express = require("express");
const path = require("path");
const fs = require("fs")
const logger = require("./middleware/logger");
const { spawn } = require('child_process')
const fetch = require("node-fetch");

const app = express();

async function updateJson() {
  const python = spawn(
    path.join(__dirname, 'python', 'venv', 'bin', 'python3'), 
    [path.join(__dirname, 'python', 'getData.py')])
  console.log("--PYTHON OUTPUT:--")
  
  python.stdout.on('data', function (data) {
    console.log(data.toString())
  });
  
  python.on('close', (code) => {
    console.log("--END OF PYTHON OUTPUT--")
    console.log(`child process close all stdio with code ${code}`);
    if (code === 0) {
      data = JSON.parse(fs.readFileSync(path.join("json","data.json")))
      posts = JSON.parse(fs.readFileSync(path.join("json","posts.json")))
    } else {
      console.log("ERROR: An error occurred while updating data!")
    }
  });
}


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




//Run on startup
let data
let posts

//Create a json folder if one does not exist
if (!fs.existsSync('json')){
  fs.mkdirSync('json')
}

//Checks if all the json files inside the folder exist and recreates them if they don't
if(fs.existsSync(path.join("json", "data.json"))) {
  console.log("data.json found")
  data = JSON.parse(fs.readFileSync(path.join("json","data.json")))
} else {
  console.log("data.json file not found. Re-Creating them...")
  updateJson()
}
if(fs.existsSync(path.join("json", "posts.json"))) {
  console.log("posts.json found")
  posts = JSON.parse(fs.readFileSync(path.join("json","posts.json")))
} else {
  console.log("posts.json file not found. Re-Creating them...")
  updateJson()
}


app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get("/update", (req, res) => {
  res.send("Updating data...")
  updateJson()
})

app.get("/api/posts", (req, res) => {
  res.json(posts)
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
