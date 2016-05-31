
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var httpServer = require("http").Server(app);
var _=require('underscore');
var mongoose = require('mongoose');
var async = require('async');
var waterfall = require('async-waterfall');
var port = process.env.PORT || 3000;
var statics = require('serve-static');
var io = require("socket.io")(httpServer);
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


var Horse = require('./models/horsemodel');
var judge = require('./models/judgemodel');
var admin = require('./models/adminmodel');


app.use('javascripts/jquery.min.js', statics(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use(statics(path.join(__dirname, '/public')));




//-------------------------------------MONGO---------------------------------------
mongoose.connect('mongodb://localhost/horses');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("connected to mongodb");
});

//------------------------------------PASSPORT----------------------------
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//require('./app/routes.js')(app, passport);

//-------------------------------------SOCKET------------------------------
//-------------------------------------HORSE----------------------------------
io.sockets.on("connection", function (socket) {


  socket.on("newHorse", function(newHorse){
    var hh = new Horse({name:newHorse.name, sex:newHorse.sex, owner:newHorse.owner});
    hh.save(function () {

    });
  });

socket.on("RefreshList", function(){
  Horse.find({},function(err, horses) {
   horses.forEach(function(horse1) {
      var horsetemp = {name:horse1.name, sex:horse1.sex, owner:horse1.owner};
      io.emit("addingHorse", horsetemp);
    });
  });
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
