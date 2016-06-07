/**
 * Created by Karol on 30.05.2016.
 */

$(function(){
    var actualscores=[];
    var actualscoresfinal =[];
    var finalscore=[];
    var socket;
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    socket.emit('RefreshScoreList');
    socket.emit('')
    socket.on("refr", function() {
        //$('#ScoreTable tbody  tr').remove();

  
        socket.emit('RefreshScoreList');
    });
    socket.on("refrr", function() {
        $('#ScoreTable tbody  tr').remove();
        $('#FinalScoreTable tbody  tr').remove();

        socket.emit('RefreshScoreList');
    });
    socket.on("counting", function(ratingtemp) {


        console.log(finalscore);



                    if ($.inArray(ratingtemp._id, actualscoresfinal) !== -1) {

                    }
                    else {
                        actualscoresfinal.push(ratingtemp._id);
                        console.log(actualscoresfinal);
                        if (finalscore.includes(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse)){

                        }else{
                            finalscore.push(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse);
                            $('#FinalScoreTable').append('<tr><td>' + ratingtemp.tournament + '</td><td>' + ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + ratingtemp.type + '</td><td>' + ratingtemp.head + '</td><td>' + ratingtemp.clog + '</td><td>' + ratingtemp.legs + '</td><td>' + ratingtemp.movement + '</td></tr>');

                        }





                    }




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