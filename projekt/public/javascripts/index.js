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

    socket.on("addingScore", function(ratingtemp) {
        console.log(actualscores);
        if ($.inArray(ratingtemp._id, actualscores) !== -1) {

        }
        else {

            $('#ScoreTable').append('<tr><td>' + ratingtemp.tournament + '</td><td>' +ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + ratingtemp.type + '</td><td>' + ratingtemp.head + '</td><td>' + ratingtemp.clog + '</td><td>' + ratingtemp.legs + '</td><td>' + ratingtemp.movement + '</td></tr>');

            actualscores.push(ratingtemp._id);
        }

    });
    var table = $('#ScoreTable');

    sorttable.makeSortable(table);





});