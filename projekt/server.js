
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
var static = require('serve-static');
var io = require("socket.io")(httpServer);

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');



require('./config/passport')(passport);


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'xxx' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




var Horse = require('./models/horsemodel');
var Judge = require('./models/judgemodel');
var Group = require('./models/groupmodel');
var admin = require('./models/adminmodel');
var Rating = require('./models/ratingmodel');
var Tournament = require('./models/tournamentmodel');
var aTournament = require('./models/atournamentmodel');


app.use('javascripts/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use(static(path.join(__dirname, '/public')));




//-------------------------------------MONGO---------------------------------------
mongoose.connect('mongodb://localhost/horses');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log("connected to mongodb");
});


//-------------------------------------SOCKET------------------------------
//-------------------------------------HORSE----------------------------------
io.sockets.on("connection", function (socket) {

    socket.on("RefreshScoreList", function(){
        console.log("przechodze tutaj");
        Rating.find({},function(err, ratings) {
            ratings.forEach(function(rate1) {
                var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};
                io.emit("addingScore", ratingtemp);
            });


        });
    });
    socket.on("RefreshFinalScoreList", function(){
        console.log("przechodze tutaj");

        Rating.find({},function(err, ratings) {
            ratings.forEach(function(rate1) {
                var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};

               io.emit("counting", ratingtemp);

            });


        });
    });




    socket.on("newHorse", function(newHorse){
    var hh = new Horse({name:newHorse.name, sex:newHorse.sex, owner:newHorse.owner});
    hh.save(function () {

    });
  });
    socket.on("SendRating", function(ratings){
        var hh = new Rating({title: ratings.string,tournament: ratings.tournament, group: ratings.group, horse: ratings.horse, judge: ratings.judge, type:ratings.type, head: ratings.head, clog:ratings.clog, legs:ratings.legs, movement:ratings.movement});
        socket.emit('RefreshScoreList');
        hh.save(function () {

        });
    });
    socket.on("newJudge", function(newJudge){
        var jj = new Judge({name:newJudge.name, surname:newJudge.surname, code:newJudge.code});
        jj.save(function () {

        });
    });
    socket.on("newGroup", function(newGroup){
        var jj = new Group({name:newGroup.name, type:newGroup.type, horses:newGroup.horses, judges:newGroup.judges});
        jj.save(function () {

        });
    });
    socket.on("newTournament", function(newTournament){
        var jj = new Tournament({name:newTournament.name, city:newTournament.city, groups:newTournament.groups});
        jj.save(function () {

        });
    });
    socket.on("newaTournament", function(newaTournament){
        var jj = new aTournament({name:newaTournament.name, city:newaTournament.city, groups:newaTournament.groups, actualgroup:newaTournament.actualgroup,  actualhorse:newaTournament.actualhorse});
        jj.save(function () {
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
    socket.on("RefreshJudgeList", function(){
        Judge.find({},function(err, judges) {
            judges.forEach(function(judge1) {
                var judgetemp = {code:judge1.code, name:judge1.name, surname:judge1.surname};
                io.emit("addingJudge", judgetemp);
            });
        });
    });

    socket.on("RefreshGroupList", function(){
        Group.find({},function(err, groups) {
           groups.forEach(function(group1) {
                var grouptemp = {name:group1.name, type:group1.type, horses:group1.horses, judges:group1.judges};
                io.emit("addingGroup", grouptemp);
            });
        });
    });

    socket.on("RefreshTournamentList", function(){
        Tournament.find({},function(err, tournaments) {
            tournaments.forEach(function(tour1) {
                var tournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups};
                io.emit("addingTournament", tournamenttemp);
            });
        });
    });

    socket.on("RefreshJudgePanel", function(name, tourjudge){
      
        aTournament.find({},function(err, panels) {
            panels.forEach(function(tour1) {
                var atournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups,  actualgroup:tour1.actualgroup ,  actualhorse:tour1.actualhorse};
                if (name === atournamenttemp.name) {
                    io.emit("addingJudgePanel", atournamenttemp, tourjudge);
                }
            });
        });
    });
    socket.on("RefreshaTournamentList", function(){
        aTournament.find({},function(err, atours) {
            atours.forEach(function(tour1) {
                var atournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups,  actualgroup:tour1.actualgroup ,  actualhorse:tour1.actualhorse};
                io.emit("addingaTournament", atournamenttemp);
            });
        });
    });

    socket.on("UpdateHorse", function(UpdateHorse){
         Horse.findOneAndUpdate({"name": UpdateHorse.id},{"name": UpdateHorse.name, "sex": UpdateHorse.sex, "owner": UpdateHorse.owner}, {new: true}, function(){});
         io.emit("deletedHorse");
       


    });
    socket.on("UpdateJudge", function(UpdateJudge){
       Judge.findOneAndUpdate({"code": UpdateJudge.id},{"code":UpdateJudge.code, "name": UpdateJudge.name, "surname": UpdateJudge.surname}, {new: true}, function(){});
        io.emit("deletedJudge");
    });

        socket.on("UpdateaTournament", function(Updateatourn){

                aTournament.findOneAndUpdate({"name": Updateatourn.name}, {"actualgroup": Updateatourn.actualgroup, "actualhorse": Updateatourn.actualhorse}, {new: true}, function () {});
                io.emit("deletedaTournament");



        });


    socket.on("deleteJudge", function(judgecode) {
        Judge.find({code: judgecode}).remove().exec();
        io.emit("deletedJudge");
    });
    socket.on("deleteHorse", function(horsecode) {
        Horse.find({name: horsecode}).remove().exec();
        io.emit("deletedHorse");
    });
    socket.on("deleteGroup", function(groupcode) {
        Group.find({name: groupcode}).remove().exec();
        io.emit("deletedGroup");
    });
    socket.on("deleteTournament", function(tournamentcode) {
        Tournament.find({name: tournamentcode}).remove().exec();
        io.emit("deletedTournament");
    });
    socket.on("deleteaTournament", function(tournamentcode) {
        Tournament.find({name: tournamentcode}).remove().exec();
        io.emit("deletedaTournament");
    });


socket.on("AddRecords", function(name,city,groups){
    var tournamenttemp;
    var tourgroup;
    var tourhorse;
    var tourjudge;
    var grouptemp;

   
    var str = groups.split(",");

    async.series([
        function(callback1) {
            Tournament.find( { name: name },function(err, tournaments) {
                tournaments.forEach(function(tour1) {
                    tournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups};
                    tourgroup=(tour1.groups);
                });
            });
            callback1();
        },
        function(callback2) {

            Group.find({name:str[0]},function(err, groups) {
                groups.forEach(function(group1) {

                    grouptemp = {name:group1.name, type:group1.type, horses:group1.horses, judges:group1.judges};
                    if (tourgroup.indexOf(group1.horses) > -1) {

                    } else {
                        tourhorse=(grouptemp.horses);
                        tourjudge=(grouptemp.judges);
                    }
                });

                callback2();
            });

        }
    ], function(err) {
        if (err) {
            throw err;

        }
       
        io.emit("FinalAddingTour",name,city,groups, tourgroup[0], tourhorse[0], tourjudge);
       // io.emit("RefreshingJudge",tourjudge);
        io.emit("CheckJudge",name,tourjudge);

    });
});
    socket.on("NextActualGroup", function(name,city,groups,actualgroup,actualhorse) {
        var tournamenttemp;
        var tourgroup;
        var tourhorse;
        var tourjudge;
        var grouptemp;
        var str = groups.split(",");
        var info =str.length;

        if(actualgroup === str[info-1] ){

        }else {
            for (i = 0; i < info; i++) {
                if (actualgroup == str[i]) {
                    actualgroup = str[i + 1];
                    break;
                }
            }

            async.series([
                function (callback1) {
                    aTournament.find({name: name}, function (err, tournaments) {
                        tournaments.forEach(function (tour1) {
                            tournamenttemp = {
                                name: tour1.name,
                                city: tour1.city,
                                groups: tour1.groups,
                                actualgroup: tour1.actualgroup,
                                actualhorse: tour1.actualhorse
                            };
                            tourgroup = (tournamenttemp.groups);
                        });
                    });
                    callback1();
                },
                function (callback2) {

                    Group.find({name: actualgroup}, function (err, groups) {
                        groups.forEach(function (group1) {

                            grouptemp = {
                                name: group1.name,
                                type: group1.type,
                                horses: group1.horses,
                                judges: group1.judges
                            };
                            if (tourgroup.indexOf(group1.horses) > -1) {

                            } else {
                                tourhorse = (grouptemp.horses);
                                tourjudge = (grouptemp.judges);
                            }
                        });

                        callback2();
                    });

                }
            ], function (err) {
                if (err) {
                    throw err;
                }
                console.log(tourjudge);
                io.emit("NextGroup", name, city, groups, actualgroup, tourhorse[0], tourjudge);
               // io.emit("RefreshingJudge");
                io.emit("CheckJudge",name,tourjudge);

            });
            // var info =str.length;
            //  if
            //  console.log(info);

        }
    });
    socket.on("NextActualHorse", function(name,city,groups,actualgroup,actualhorse){
        var tournamenttemp;
        var tourgroup;
        var tourhorse=[];
        var tourjudge;
        var grouptemp;


        async.series([
            function(callback1) {
                Tournament.find( { name: name },function(err, tournaments) {
                    tournaments.forEach(function(tour1) {
                        tournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups};
                        tourgroup=(tour1.groups);
                    });
                });
                callback1();
            },
            function(callback2) {

                Group.find({name:actualgroup},function(err, groups) {
                    groups.forEach(function(group1) {

                        grouptemp = {name:group1.name, type:group1.type, horses:group1.horses, judges:group1.judges};
                        if (tourgroup.indexOf(group1.horses) > -1) {

                        } else {
                            tourhorse=(grouptemp.horses);
                            tourjudge=(grouptemp.judges);
                        }
                    });

                    callback2();
                });

            }
        ], function(err) {
            if (err) {
                throw err;


            }

            var info =tourhorse.length;

            if(actualhorse === tourhorse[info-1] ){

            }else {
                for (i=0; i < info; i++) {
                    if (actualhorse == tourhorse[i]) {
                        actualhorse = tourhorse[i + 1];
                        io.emit("NextGroup",name,city,groups, actualgroup, actualhorse, tourjudge);
                        io.emit("CheckJudge",name,tourjudge);
                        break;

                    }
                }
            }


        });
    });

    socket.on("NextActualWarning", function(name,city,groups,actualgroup,actualhorse){
        var tournamenttemp;
        var tourgroup;
        var tourhorse=[];
        var tourjudge;
        var grouptemp;


        async.series([
            function(callback1) {
                Tournament.find( { name: name },function(err, tournaments) {
                    tournaments.forEach(function(tour1) {
                        tournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups};
                        tourgroup=(tour1.groups);
                    });
                });
                callback1();
            },
            function(callback2) {

                Group.find({name:actualgroup},function(err, groups) {
                    groups.forEach(function(group1) {

                        grouptemp = {name:group1.name, type:group1.type, horses:group1.horses, judges:group1.judges};
                        if (tourgroup.indexOf(group1.horses) > -1) {

                        } else {
                            tourhorse=(grouptemp.horses);
                            tourjudge=(grouptemp.judges);
                        }
                    });

                    callback2();
                });

            }
        ], function(err) {
            if (err) {
                throw err;


            }

            var info =tourhorse.length;

            io.emit("Warning",name,tourjudge)
              

                    
                
            


        });
    });


    socket.on("deleteScores", function() {

        async.series([
            function(callback) {
                Rating.find({}).remove().exec();    //To sie wykonuje, ale socket juz nie
                callback();
            },

        ], function(err) {
            io.emit('refrr');

        });
    });
    
    socket.on("newScores", function() {
        io.emit('refr');
    });


});





//-------------------------------------ROUTES-------------------------------



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});
require('./routes/routes.js')(app, passport);
app.get('/judge', function (req, res) {
  res.sendFile(__dirname + '/public/judge.html');
});


httpServer.listen(port, function () {
  console.log('Server listen on port ' + port+'!');
});
module.exports = app;