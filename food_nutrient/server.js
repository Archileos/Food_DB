const express = require("express");
const restAPI = require(__dirname + "\\restAPI.js");
let app = express();

app.use(express.static('public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    extended: false
}))

restAPI.createAPI(app)