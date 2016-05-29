var express = require('express');
var starttournament = false;
var app = express();
var path = require('path');
var httpServer = require("http").Server(app);
var _=require('underscore');
var mongoose = require('mongoose');
var async = require('async');
var waterfall = require('async-waterfall');
var port = process.env.PORT || 3000;
var static = require('serve-static');
var io = require("socket.io")(httpServer)

var horse = require('./models/horsemodel');
var judge = require('./models/judgemodel');
var admin = require('./models/adminmodel');


app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use(static(path.join(__dirname, '/public')));




//-------------------------------------MONGO---------------------------------------
mongoose.connect('mongodb://localhost/horses');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("MongoDB Connection Established");
});


//-------------------------------------SOCKET.IO------------------------------
io.sockets.on("connection", function (socket) {
  socket.on("starttournament", function(){
    if(starttournament){
      io.emit("starttournamenttext", "Already in progres, click abandon to start new")
    }else{
      starttournament = true;
      io.emit("starttournamenttext", "Tournament started succesfuly!")
    }
  });
  socket.on("error", function (err) {
    console.dir(err);
  });
    
});


//-------------------------------------ROUTES-------------------------------
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});
app.get('/judge', function (req, res) {
  res.sendFile(__dirname + '/public/judge.html');
});

httpServer.listen(port, function () {
  console.log('Server listen on port ' + port+'!');
});
module.exports = app;
