/**
 * Created by Karol on 30.05.2016.
 */
/* global io: true */
"use strict";
var tournament;
var group;
var horse;
var param;
var firstparam;
var socket;
var unrated;
var actualstring;


$(function() {

    //logged as:
    //alert($("#logged").text());

    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }


        param = $("#logged").text();
        socket.emit('CheckJudge', param);
        firstparam=param;

    socket.on("checkingJudge", function () {
        console.log("1");
       socket.emit('CheckJudge', param);
    });

    socket.on("checkedJudge", function (param,atournamenttemp) {
        console.log("2");
        $('#JudgeWarning').text("");


        var name=atournamenttemp.name;
        for (var i=0;i<atournamenttemp.judges.length;i++) {

            if (param === atournamenttemp.judges[i]) {
                $('#LoggedAS').text(param);

                socket.emit('RefreshJudgePanel', name, atournamenttemp, param);

            }

        }


    });
    socket.on("Warning", function (name,tourjudge) {
        console.log("3");
        for (var i=0;i<tourjudge.length;i++) {

            if (param === tourjudge[i]) {
                $('#JudgeWarning').text("Hurry Up");
                var x = document.getElementById("JudgeTable").getElementsByTagName("td");
                if (unrated.type===null || unrated.type==="00" ){ x[5].style.backgroundColor = "red";}
                if  (unrated.head===null || unrated.head==="00"){ x[6].style.backgroundColor = "red";}
                if   (unrated.clog===null || unrated.clog==="00"){ x[7].style.backgroundColor = "red";}
                if  (unrated.legs===null || unrated.legs==="00"){ x[8].style.backgroundColor = "red";}
                if  ( unrated.movement===null || unrated.movement==="00"){  x[9].style.backgroundColor = "red"; }
                console.log(unrated);



            }
        }
    });

    socket.on("TournamentEnd", function (tournamentcode) {
        if (tournamentcode === tournament) {
        
        $('#JudgeTable').find("tbody").find("tr").remove();
        actualstring = "";
       }

    });



    socket.on("addingJudgePanel", function (temporary, positonselector, params) {
        console.log("5");
        if (firstparam === params) {

        for (var i=0;i<temporary.judges.length;i++)
        {

            if (param === temporary.judges[i]) {

                    if (actualstring === temporary.name + temporary.actualgroup + temporary.actualhorse) {
                        console.log("");
                    } else {
                        var some=$('#JudgeTable');
                        some.find("tbody").find("tr").remove();

                        $('#JudgeWarning').text("");
                        tournament = temporary.name;
                        group = temporary.actualgroup;
                        horse = temporary.actualhorse;

                        some.append('<tr><td hidden>' + temporary.name + '</td><td hidden>' + temporary.city + '</td><td hidden>' + temporary.groups + '</td><td hidden>' + temporary.actualgroup + '</td><td>' + temporary.actualhorse + '</td><td><select id="type" onchange="changedetected()"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="head" onchange="changedetected()"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="clog" onchange="changedetected()"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="legs" onchange="changedetected()"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="movement" onchange="changedetected()"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td></tr>');
                        $("#type").val(positonselector.type);
                        $("#head").val(positonselector.head);
                        $("#clog").val(positonselector.clog);
                        $("#legs").val(positonselector.legs);
                        $("#movement").val(positonselector.movement);

                        var a = positonselector.type;
                        var b = positonselector.head;
                        var c = positonselector.clog;
                        var d = positonselector.legs;
                        var e = positonselector.movement;
                        unrated = {type: a, head: b, clog: c, legs: d, movement: e};
                        console.log(unrated);


                        actualstring = temporary.name + temporary.actualgroup + temporary.actualhorse;
                    }
                }
            }
        }
    });


    //  socket.on("RatedHorse", function(temporary){
    //      $("#JudgeTable tbody  tr").remove();
    //
    // });


    // $('#JudgeTable').on('click', '.btn.btn-info', function() {
    //     var tournament = $(this).closest('tr').find('td:eq(0)').text();
    //     var group = $(this).closest('tr').find('td:eq(3)').text();
    //     var horse = $(this).closest('tr').find('td:eq(4)').text();
    //     var judge = param;
    //     var type = $(this).closest('tr').find('td:eq(5) option:selected').val();
    //     var head = $(this).closest('tr').find('td:eq(6) option:selected').val();
    //     var clog = $(this).closest('tr').find('td:eq(7) option:selected').val();
    //     var legs = $(this).closest('tr').find('td:eq(8) option:selected').val();
    //     var movement = $(this).closest('tr').find('td:eq(9) option:selected').val();
    //     var unique=tournament+group+horse+judge;
    //     var ratings = {title:unique ,tournament: tournament, group: group, horse: horse, judge: judge, type:type, head:head, clog:clog, legs:legs, movement:movement};
    //     socket.emit("SendRating", ratings);
    //     socket.emit("newScores");
    //
    //     var button = "#rate";
    //     $(button).val("Rated").prop('disabled', true);
    //
    // 
    //
    // });



 });
function changedetected() {
    var ratings = {tournament:tournament, group:group, horse:horse,judge:param, type: $('#type').val(), head: $('#head').val(), clog:$('#clog').val(), legs: $('#legs').val(),movement: $('#movement').val()};
    console.log(ratings);
    unrated ={type:ratings.type,head:ratings.head, clog:ratings.clog, legs:ratings.legs, movement:ratings.movement};
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    var x = document.getElementById("JudgeTable").getElementsByTagName("td");
    if (ratings.type!==null && ratings.type!=="00" ){ x[5].style.backgroundColor = "";}
    if  (ratings.head!==null && ratings.head!=="00"){ x[6].style.backgroundColor = "";}
    if   (ratings.clog!==null && ratings.clog!=="00"){ x[7].style.backgroundColor = "";}
    if  (ratings.legs!==null && ratings.legs!=="00"){ x[8].style.backgroundColor = "";}
    if  ( ratings.movement!==null && ratings.movement!=="00"){  x[9].style.backgroundColor = ""; }
        if (ratings.type===null){ratings.type="00";}
        if (ratings.head===null){ratings.head="00";}
        if (ratings.clog===null){ratings.clog="00";}
    if(ratings.legs===null){ratings.legs="00";}
    if (ratings.movement===null){ratings.movement="00";}


        socket.emit("UpdateRatingServer", ratings);
        socket.emit("RefreshScoreList");


}

