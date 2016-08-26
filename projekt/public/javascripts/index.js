/**
 * Created by Karol on 30.05.2016.
 */
/* global io: true */
"use strict";




$(function(){

    var id;
    var actualscores=[];
    var actualscoresfinal=[];
    var tourname=[];

    var socket;
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }

    $("#finscore").on('click', "p", function() {
        $(this).next().toggle();
    });


    //$("#FinalScoreTable").empty();
    socket.emit('RefreshScoreList');
    socket.emit('RefreshFinalScoreList');
    socket.on("showTable", function() {
        $('#ScoreTable').find("tbody").find("tr").remove();
        $('#FinalScoreTable').find("tbody").find("tr").remove();
        actualscores=[];
        socket.emit('RefreshScoreList');
        socket.emit('RefreshFinalScoreList');
    });
    socket.on("refrr", function() {
        $('#ScoreTable').find("tbody").find("tr").remove();
        $('#FinalScoreTable').find("tbody").find("tr").remove();
        actualscores=[];
        actualscoresfinal=[];

        console.log(tourname.length);
        for(var i=0;i<tourname.length;i++){
            $("p").remove();
            $('#' + tourname[i]).remove();
            console.log("usunieto");
        }
        tourname =[];


        socket.emit('RefreshScoreList');
        socket.emit('RefreshFinalScoreList');
    });

    socket.on("addingScore", function(ratingtemp) {
        if ($.inArray(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ratingtemp.judge, actualscores) !== -1) {
            console.log();
            var aid="td#id"+ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge;
             $(aid).parent().replaceWith('<tr><td id="id' +ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge+'">' + ratingtemp.tournament + '</td><td>' +  ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' +  ratingtemp.type + '</td><td>' +  ratingtemp.head + '</td><td>' +  ratingtemp.clog + '</td><td>' +  ratingtemp.legs + '</td><td>' +  ratingtemp.movement  + '</td></tr>');

        }
        else {
            if (ratingtemp.type==="00" || ratingtemp.head==="00" || ratingtemp.clog==="00" || ratingtemp.legs==="00" || ratingtemp.movement==="00" ){
                console.log();
            }else{
            $('#ScoreTable').append('<tr><td id="id'+ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge+'">' + ratingtemp.tournament + '</td><td>' +ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + Number(ratingtemp.type) + '</td><td>' + Number(ratingtemp.head) + '</td><td>' + Number(ratingtemp.clog) + '</td><td>' + Number(ratingtemp.legs) + '</td><td>' + Number(ratingtemp.movement) + '</td></tr>');
            actualscores.push(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ratingtemp.judge);
               // $('#ScoreTable').trigger("update");
               // $('#ScoreTable').tablesorter( {sortList: [[7,1]]} );
            }

        }

    });

    socket.on("addingfinalScore", function(ratingfinal) {

        var selector='#' + ratingfinal.tournament;

            if (actualscoresfinal.indexOf(ratingfinal.tournament + ratingfinal.group + ratingfinal.horse)===-1) {


                if (tourname.indexOf(ratingfinal.tournament)>-1)
                {
                    console.log();


                   // $( "#FinalScoreTable" ).clone().appendTo( ".table-responsive" );
                }else{
                    $( "#finscore" ).append( '<p>Tournament: '+ratingfinal.tournament+'</p>');
                    $("#FinalScoreTable").show();
                    $("#FinalScoreTable").clone().attr('id', ratingfinal.tournament).appendTo( "#finscore" );
                    $("#FinalScoreTable").hide();


                }
                $(selector).append('<tr><td>Group:' + ratingfinal.group + '</td><td>Horse:' + ratingfinal.horse + '</td><td>' + Number(ratingfinal.type) + '</td><td>' + Number(ratingfinal.head) + '</td><td>' + Number(ratingfinal.clog) + '</td><td>' + Number(ratingfinal.legs) + '</td><td>' + Number(ratingfinal.movement) + '</td><td>' + Number(ratingfinal.all) + '</td></tr>');


                actualscoresfinal.push(ratingfinal.tournament + ratingfinal.group + ratingfinal.horse);
                tourname.push(ratingfinal.tournament);


               $(selector).triggerHandler("update");
                $(selector).tablesorter();
               var sorting = [[7,1],[2,1],[6,1]];
               $(selector).trigger("sorton",[sorting]);
                


            }



   });

});

