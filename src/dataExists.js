const fs = require('fs')
const path = require('path');
const {updateJsonSync} = require('./updateJson.js')

function dataExists() {
    let data
    let posts

    //Create a json folder if one does not exist
    if (!fs.existsSync('json')) {
        fs.mkdirSync('json')
    }

    //Checks if all the json files inside the folder exist before starting the server and creates them if needed.
    if (fs.existsSync(path.join("json", "data.json")) && fs.existsSync(path.join("json", "posts.json"))) {
        console.log("All JSON files found")
        data = JSON.parse(fs.readFileSync(path.join("json", "data.json")))
        posts = JSON.parse(fs.readFileSync(path.join("json", "posts.json")))

        return ({ data, posts })
    } else {
        console.log("Not all JSON files were found. Re-Creating them...")
        return (updateJsonSync())
    }
}

module.exports = dataExists;