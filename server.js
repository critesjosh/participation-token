var http = require('http')
var fs = require('fs')
//var https =require("https")
var path = require('path')
var bodyParser = require('body-parser')
require('dotenv').config()

//utilities
var api = require("./api/api")
var authenticate = require('./utils/authenticate')
var ptcInstance = require('./utils/getContracts')

var express = require('express')
var app = express();

// const credentials = {
//   cert: fs.readFileSync("/etc/letsencrypt/live/aqui.joshcrites.com/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/aqui.joshcrites.com/privkey.pem")
// }
//var server = https.createServer(credentials, app)
var server = http.createServer(app);

var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/participation-token"

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(url);

app.use(express.static(path.resolve(__dirname, "build_webpack")))

api.init(app, mongoose)

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build_webpack/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port)
});
