/* jshint strict: true ,evil:true, node: true , browser:true */
/* global io: true */
'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');
var https = require('https');
var http = require('http');
var mongoose = require('mongoose');
var statics = require('serve-static');
var async = require('async');
var waterfall = require('async-waterfall');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');

var options = {
    key: fs.readFileSync('ssl/key.pem'),
    cert: fs.readFileSync('ssl/crt.pem')
};
var Horse = require('./models/horsemodel');
var Judge = require('./models/judgemodel');
var Group = require('./models/groupmodel');
var Rating = require('./models/ratingmodel');
var Tournament = require('./models/tournamentmodel');
var FinalRating = require('./models/finalratingmodel');
var aTournament = require('./models/atournamentmodel');
var Account = require('./models/account');



app.use('javascripts/jquery.min.js', statics(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use(statics(path.join(__dirname, '/public')));

var serverPort = 443;

var server = https.createServer(options, app);
var io = require('socket.io')(server);


app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
//-------------------------------------------------------passport
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.set('view engine', 'jade');



passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use('/js/jquery.min.js', statics(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use(statics(path.join(__dirname, '/public')));

app.use('/', routes);

app.use(logger('dev'));
app.use(bodyParser.json());


//~~~~~~~~~~~~~~~~~~~~~~~~~~baza~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

mongoose.connect('mongodb://localhost/horses');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error'));
db.once('open', function () {
    console.log("Connected to mongodb!");

});

var LoggedAdmin = function() {
    return function(req, res, next) {
        if(req.user){
            if (req.user.role === 'admin'){
                next();
            }
            else{   res.redirect('/login');}
        }else{ res.redirect('/login');}

    };
};

var LoggedJudge = function() {
    return function(req, res, next) {
        if(req.user) {
            if (req.user.role === 'judge'){
                next();
                return req.user.username;
            }
            else{ res.redirect('/login');}

        }else{            res.redirect('/login');}
    };
};
//-------------------------------------SOCKET------------------------------
//-------------------------------------HORSE----------------------------------
io.sockets.on("connection", function (socket) {

    var countingarray=[];
    var actualscoresfinal =[];
    var counting;
    var finalscore=[];

    socket.on("RefreshScoreList", function(){
        
        Rating.find({},function(err, ratings) {
            ratings.forEach(function(rate1) {
                var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse, judge:rate1.judge, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};
                io.emit("addingScore", ratingtemp);
            });


        });
    });


    socket.on("newHorse", function(newHorse){
        var hh = new Horse({name:newHorse.name,realname:newHorse.realname, sex:newHorse.sex, owner:newHorse.owner});
        hh.save(function () {

        });
    });
    socket.on("newJudge", function(newJudge){
        var jj = new Judge({name:newJudge.name, surname:newJudge.surname, code:newJudge.code});
        Account.register(new Account({ username : newJudge.code, role: "judge" }), newJudge.surname, function(err, account) {});
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
        var jj = new aTournament({name:newaTournament.name, city:newaTournament.city, groups:newaTournament.groups, actualgroup:newaTournament.actualgroup,  actualhorse:newaTournament.actualhorse, judges:newaTournament.judges});
        jj.save(function () {
        });

    });

    socket.on("RefreshList", function(){
        Horse.find({},function(err, horses) {
            horses.forEach(function(horse1) {
                var horsetemp = {name:horse1.name,realname:horse1.realname ,sex:horse1.sex, owner:horse1.owner};
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

    socket.on("RefreshJudgePanel", function(name, atournamenttemp2 ,param){

        aTournament.find({},function(err, panels) {
            panels.forEach(function(tour1) {
                var atournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups,  actualgroup:tour1.actualgroup ,  actualhorse:tour1.actualhorse ,judges:tour1.judges};
                if (name === atournamenttemp.name) {
                    var selectorposition;
                    Rating.findOne({"tournament": atournamenttemp2.name, "group": atournamenttemp2.actualgroup, "horse":atournamenttemp2.actualhorse, "judge":param},function(err,found) {
                        if(found){
                            selectorposition = { type:found.type, head:found.head, clog:found.clog, legs:found.legs, movement:found.movement };
                            io.emit("addingJudgePanel", atournamenttemp,selectorposition,param);
                        }else{
                            selectorposition = {type:null, head:null, clog:null, legs:null, movement:null };
                            io.emit("addingJudgePanel", atournamenttemp,selectorposition,param);
                        }

                    });

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

        aTournament.findOneAndUpdate({"name": Updateatourn.name}, {"actualgroup": Updateatourn.actualgroup, "actualhorse": Updateatourn.actualhorse, "judges": Updateatourn.judges}, {new: true}, function () {});
        io.emit("deletedaTournament");
        io.emit("checkingJudge");



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
        console.log(tournamentcode);
        aTournament.find({name: tournamentcode}).remove().exec();
        io.emit("deletedaTournament");
        io.emit("TournamentEnd",tournamentcode);
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
                       // if (tourgroup.indexof(group1.horses) > -1) {

                       // } else {
                            tourhorse=(grouptemp.horses);
                            tourjudge=(grouptemp.judges);
                       // }
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
          //  io.emit("CheckJudge",name,tourjudge);
            io.emit("checkingJudge");

        });
    });
    socket.on("NextActualGroup", function(name,city,groups,actualgroup) {
        var tournamenttemp;
        var tourgroup;
        var tourhorse;
        var tourjudge;
        var grouptemp;
        var grouprank=[];
        var tourjud;
        var tourhor;
        var actgrp=actualgroup;
        var str = groups.split(",");
        var info =str.length;

        if(actualgroup === str[info-1] ){
         console.log();
        }else {
            for (var i = 0; i < info; i++) {
                if (actualgroup === str[i]) {
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
                                console.log("");
                            } else {
                                tourhorse = (grouptemp.horses);
                                tourjudge = (grouptemp.judges);



                            }
                        });
                        callback2();
                    });

                },
                function (callback3) {
                    Rating.find({group:actgrp },function(err, ratings) {
                        ratings.forEach(function(rate1) {
                            var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse,judge:rate1.judge, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};
                            if (ratingtemp.tournament === name){grouprank.push(ratingtemp.judge);}else{grouprank[0]="0";}
                        });
                        callback3();
                    });


                },
                function (callback4) {

                    Group.find({name: actgrp}, function (err, groups) {
                        groups.forEach(function (group1) {

                            grouptemp = {
                                name: group1.name,
                                type: group1.type,
                                horses: group1.horses,
                                judges: group1.judges
                            };
                            if (tourgroup.indexOf(group1.horses) > -1) {
                                console.log("");

                            } else {

                                tourjud= (grouptemp.horses);
                                tourhor = (grouptemp.judges);
                            }
                        });

                        callback4();
                    });

                }
            ], function (err) {
                if (err) {
                    throw err;
                }

              if  (typeof(tourjud) !== "undefined"){
                  if (grouprank.length === (tourjud.length * tourhor.length)) {
                      io.emit("NextGroup", name, city, groups, actualgroup, tourhorse[0], tourjudge);
                      io.emit("checkingJudge");
                      io.emit("showTable");

                  }
              }
            });

        }
    });
    socket.on("NextActualHorse", function(name,city,groups,actualgroup,actualhorse){
        var tournamenttemp;
        var tourgroup;
        var tourhorse=[];
        var tourjudge;
        var grouptemp;
        var grouprank=[];


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
                            console.log("");

                        } else {
                            tourhorse=(grouptemp.horses);
                            tourjudge=(grouptemp.judges);
                        }
                    });

                    callback2();
                });

            },
            function (callback3) {

                Rating.find({group:actualgroup , horse:actualhorse},function(err, ratings) {
                    ratings.forEach(function(rate1) {
                        var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse,judge:rate1.judge, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};
                        if (ratingtemp.tournament === name){grouprank.push(ratingtemp.judge);}else{grouprank[0]="0";}

                    });
                    callback3();
                });


            }
        ], function(err) {
            if (err) {
                throw err;


            }

            var info =tourhorse.length;

            if(actualhorse === tourhorse[info-1] ){
                console.log("");

            }else {

                for (var i=0; i < info; i++) {
                    if (actualhorse === tourhorse[i]) {
                        if (grouprank.length===tourjudge.length){
                        actualhorse = tourhorse[i + 1];
                        io.emit("NextGroup",name,city,groups, actualgroup, actualhorse, tourjudge);
                            io.emit("checkingJudge");
                            io.emit("showTable");


                        break;

                        }

                    }
                }

            }
        });
    });
    socket.on("EndTournament", function(name,city,groups,actualgroup, actualhorse) {
        var grouptemp;
        var horses;
        var grouprank=[];
        var str = groups.split(",");
        var info =str.length;
        var judges;


        async.series([

            function(callback1) {

                Group.find({name:actualgroup},function(err, groups) {
                    groups.forEach(function(group1) {

                        grouptemp = {
                            name: group1.name,
                            type: group1.type,
                            horses: group1.horses,
                            judges: group1.judges
                        };

                        horses=grouptemp.horses;
                        judges=(grouptemp.judges);

                    });

                });


            callback1();
            },
            function (callback2) {


                Rating.find({group:actualgroup , horse:actualhorse},function(err, ratings) {
                    ratings.forEach(function(rate1) {
                        var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse,judge:rate1.judge, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};
                        if (ratingtemp.tournament === name){grouprank.push(ratingtemp.judge);}else{grouprank[0]="0";}
                    });
                    callback2();
                });


            }
        ], function(err) {
            if (err) {
                throw err;


            }
            
              //3 warunki ostatnia grupa, ostatni kon i wszystkie oceny i bangladesz
            if (actualgroup.valueOf()===str[info-1].valueOf() && actualhorse.valueOf()===horses[horses.length-1].valueOf() && grouprank.length===judges.length){
                var tourjudge=null;
                io.emit("EndOfTournament",name,tourjudge);
                io.emit("showTable");
                io.emit("TournamentEnd",name);
            }

        });
    });
    

    socket.on("NextActualWarning", function(name,city,groups,actualgroup){
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
                            console.log("");

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


            io.emit("Warning",name,tourjudge);


        });
    });
    socket.on("deleteScores", function() {

        async.series([
            function(callback) {
                Rating.find({}).remove().exec();
                FinalRating.find({}).remove().exec();
                callback();
            }

        ], function() {
            io.emit('refrr');

        });
    });
    socket.on("newScores", function() {
        io.emit('refr');
    });
    socket.on("CheckJudge", function (param) {
        aTournament.find({},function(err, atours) {
            atours.forEach(function(tour1) {
                var atournamenttemp = {name:tour1.name, city:tour1.city, groups:tour1.groups,  actualgroup:tour1.actualgroup ,  actualhorse:tour1.actualhorse , judges:tour1.judges};
                io.emit("checkedJudge",param, atournamenttemp);


            });
        });

    });




    socket.on("AddFinalScore", function()
    {
        Rating.find({},function(err, ratings) {
            ratings.forEach(function(rate1) {
                var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse, judge:rate1.judge, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};
               io.emit("countingscoreadmin", ratingtemp);
            });


     });
    });

    socket.on("countingscore", function(ratingtemp)
    {

        if (actualscoresfinal.indexOf(ratingtemp._id)>-1) {
            console.log();
                            }
                            else {
                                actualscoresfinal.push(ratingtemp._id);
                                if (finalscore.indexOf(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse)>-1){

                                    for (var i=0;i<countingarray.length;i++){
                                        if(countingarray[i].tournament+countingarray[i].group+countingarray[i].horse===ratingtemp.tournament + ratingtemp.group + ratingtemp.horse){
                                            var value1=parseFloat(countingarray[i].type)+parseFloat(ratingtemp.type);
                                            var value2=parseFloat(countingarray[i].head)+parseFloat(ratingtemp.head);
                                            var value3=parseFloat(countingarray[i].clog)+parseFloat(ratingtemp.clog);
                                            var value4=parseFloat(countingarray[i].legs)+parseFloat(ratingtemp.legs);
                                            var value5=parseFloat(countingarray[i].movement)+parseFloat(ratingtemp.movement);
                                            var all=value1+value2+value3+value4+value5;
                                            countingarray[i].type=(value1);
                                            countingarray[i].head=(value2);
                                            countingarray[i].clog=(value3);
                                            countingarray[i].legs=(value4);
                                            countingarray[i].movement=(value5);
                                            countingarray[i].all=(all);
                                            countingarray[i].counter=countingarray[i].counter+1;
                                            break;
                                        }
                                    }
                                }else{


                                    counting =({tournament:ratingtemp.tournament,group:ratingtemp.group, horse: ratingtemp.horse, type: ratingtemp.type ,head: ratingtemp.head , clog: ratingtemp.clog , legs: ratingtemp.legs ,movement: ratingtemp.movement,all:parseFloat(ratingtemp.type)+parseFloat(ratingtemp.head)+parseFloat(ratingtemp.clog)+parseFloat(ratingtemp.legs) +parseFloat(ratingtemp.movement), counter:1});
                                    countingarray.push(counting);

                                    finalscore.push(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse);


                                }
                            }

              //  var some=$('#FinalScoreTable');
             //  some.find("tbody").find("tr").remove();
                for (var j=0;j<countingarray.length;j++){

                    var finalsave = new FinalRating({id:countingarray[j].tournament+countingarray[j].group+countingarray[j].horse, tournament:countingarray[j].tournament,group:countingarray[j].group, horse: countingarray[j].horse, type:countingarray[j].type/countingarray[j].counter, head:countingarray[j].head/countingarray[j].counter,clog:countingarray[j].clog/countingarray[j].counter,legs:countingarray[j].legs/countingarray[j].counter,movement:countingarray[j].movement/countingarray[j].counter, all:countingarray[j].all/countingarray[j].counter});
                    finalsave.save(function () {

                    });
                  //  some.append('<tr><td id="id'+countingarray[j].tournament+countingarray[j].group+countingarray[j].horse +'">' +countingarray[j].tournament + '</td><td>' +countingarray[j].group + '</td><td>' + countingarray[j].horse + '</td><td>' + countingarray[j].type/countingarray[j].counter + '</td><td>' + countingarray[j].head/countingarray[j].counter + '</td><td>' + countingarray[j].clog/countingarray[j].counter + '</td><td>' + countingarray[j].legs/countingarray[j].counter + '</td><td>' + countingarray[j].movement/countingarray[j].counter + '</td><td>' + countingarray[j].all/countingarray[j].counter + '</td></tr>');
                  //  socket.emit("addfinalscores",counting);


                }

            });



    socket.on("RefreshFinalScoreList", function(){

        FinalRating.find({},function(err, ratings) {
            ratings.forEach(function(rate1) {
                var ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse, judge:rate1.judge, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};

                io.emit("addingfinalScore", ratingtemp);
                // io.emit('counting', ratingtemp);
            });


        });
    });



    // socket.on("NewRatingServer",function(ratingsnew) {
    //     var hh = new Rating({title: ratingsnew.string,tournament: ratingsnew.tournament, group: ratingsnew.group, horse: ratingsnew.horse, judge: ratingsnew.judge, type:ratingsnew.type, head: ratingsnew.head, clog:ratingsnew.clog, legs:ratingsnew.legs, movement:ratingsnew.movement});
    //     socket.emit('RefreshScoreList');
    //     hh.save(function () {
    //
    //     });

    //});
    socket.on("UpdateRatingServer", function(ratingsnew){
        Rating.findOneAndUpdate({"tournament": ratingsnew.tournament,"group": ratingsnew.group,"horse": ratingsnew.horse,"judge": ratingsnew.judge},{"type": ratingsnew.type, "head": ratingsnew.head, "clog": ratingsnew.clog, "legs": ratingsnew.legs,"movement": ratingsnew.movement}, {new: true, upsert: true}, function(){});
        socket.emit('RefreshScoreList');

    });



});


//server
server.listen(serverPort, function() {
    console.log('server up and running at %s port', serverPort);
});
app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/public/index.ejs');
    res.render(__dirname + '/public/index.ejs');
});
//app.get('/loginerror', function (req, res) {
    //res.render(__dirname + '/public/loginerror.ejs');
//});
app.get('/register',LoggedAdmin(), function(req, res) {
    res.render('register', { });
});
app.post('/login', passport.authenticate('local'), function(req, res) {
    if (req.user.role==="judge"){
        res.redirect('/judge');
    }else{
        res.redirect('/admin');

    }

});
app.post('/register', LoggedAdmin(), function(req, res) {
    Account.register(new Account({ username : req.body.username, role: req.body.role }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        res.redirect('/login');

    });
});

app.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', LoggedAdmin(), function (req, res) {
    res.sendFile(__dirname + '/public/admin.html');
});
app.get('/judge', LoggedJudge(), function (req, res) {
   // res.sendFile(__dirname + '/public/judge.ejs');
    res.render(__dirname + '/public/judge.ejs', {judgecode: req.user.username});
});



module.exports = app;

