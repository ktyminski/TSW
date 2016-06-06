/**
 * Created by Karol on 30.05.2016.
 */

$(function(){
    var actualscores=[];
    var socket;
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    socket.emit('RefreshScoreList');
    //socket.emit('RefreshFinalScoreList')

    socket.on("refr", function() {
        //$('#ScoreTable tbody  tr').remove();

  
        socket.emit('RefreshScoreList');
    });
    socket.on("refrr", function() {
        $('#ScoreTable tbody  tr').remove();

        socket.emit('RefreshScoreList');
    });
    socket.on("counting", function(ratingtemp) {
        //ratingtemp = {_id:rate1._id, tournament:rate1.tournament,group:rate1.group, horse:rate1.horse, type:rate1.type, head:rate1.head,clog:rate1.clog,legs:rate1.legs,movement:rate1.movement};

    });



    socket.on("addingScore", function(ratingtemp) {
        if ($.inArray(ratingtemp._id, actualscores) !== -1) {

        }
        else {

            $('#ScoreTable').append('<tr><td>' + ratingtemp.tournament + '</td><td>' +ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + ratingtemp.type + '</td><td>' + ratingtemp.head + '</td><td>' + ratingtemp.clog + '</td><td>' + ratingtemp.legs + '</td><td>' + ratingtemp.movement + '</td></tr>');

            actualscores.push(ratingtemp._id);
        }
    });




});