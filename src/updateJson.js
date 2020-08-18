const path = require('path');
const fs = require('fs');
const { spawnSync, spawn } = require('child_process');

//Update all the json files by running the getData python script
async function updateJson() {

    const python = spawn(
      path.join(__dirname, '..', 'python', 'venv', 'bin', 'python3'), 
      [path.join(__dirname, '..', 'python', 'getData.py')])
    console.log("--PYTHON OUTPUT:--")
    
    python.stdout.on('data', function (data) {
      console.log(data.toString())
    });
    
    python.on('close', (code) => {
      console.log("--END OF PYTHON OUTPUT--")
      console.log(`child process close all stdio with code ${code}`);
      if (code === 0) {
        let data = JSON.parse(fs.readFileSync(path.join("json","data.json")))
        let posts = JSON.parse(fs.readFileSync(path.join("json","posts.json")))
        return {data, posts}
      } else {
        throw "ERROR: An error occurred while updating data!"
      }
    });
  }

  function updateJsonSync() {

    spawnSync(
      path.join(__dirname, '..', 'python', 'venv', 'bin', 'python3'), 
      [path.join(__dirname, '..', 'python', 'getData.py')])
    
      let data = JSON.parse(fs.readFileSync(path.join("json","data.json")))
      let posts = JSON.parse(fs.readFileSync(path.join("json","posts.json")))
      return {data, posts}

  }

  module.exports = { updateJson , updateJsonSync }