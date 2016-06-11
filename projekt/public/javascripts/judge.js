/**
 * Created by Karol on 30.05.2016.
 */
var tournament;
var group;
var horse;
var param;
var socket;
var ifalreadyrated=[];

$(function() {

    var socket;
    var actualstring;


    $('#LoginButton').on('click', '.btn.btn-info', function() {

    });

    

    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    socket.emit('RefreshJudgePanel');

    $("#LoginButton").click( function () {
        param = $('#codeInput').val();
        socket.emit('CheckJudge', param);

    });
    socket.on("checkingJudge", function () {
       socket.emit('CheckJudge', param); 
    });






    
    socket.on("checkedJudge", function (param,atournamenttemp) {
        name=atournamenttemp.name;
        for (i=0;i<atournamenttemp.judges.length;i++) {

            if (param === atournamenttemp.judges[i]) {

                socket.emit('RefreshJudgePanel', name, atournamenttemp.judges);

            }
        }

    });
    socket.on("Warning", function (name,tourjudge) {
        for (i=0;i<tourjudge.length;i++) {

            if (param === tourjudge[i]) {
                $('#JudgeWarning').text("Hurry Up");
            }
        }
    });
    
    socket.on("NewRating", function(ratingsnew, ratingtemp){
        ifalreadyrated.push(ratingsnew.tournament+ratingsnew.group+ratingsnew.horse+ratingsnew.judge);
        console.log(ratingsnew);
        console.log(ratingtemp);
        if (ifalreadyrated===(ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge)){
            socket.emit("UpdateRatingServer",ratingsnew);
            socket.emit("newScores");
            console.log("a");
        }else{
            socket.emit("NewRatingServer",ratingsnew);
            console.log("b");
            socket.emit("newScores");
        }
    });


    socket.on("addingJudgePanel", function (temporary) {

        for (i=0;i<temporary.judges.length;i++)
        {

            if (param === temporary.judges[i]){
                if (actualstring===temporary.name+temporary.groups+temporary.horses){

                    }else{

                    $('#LoggedAS').text(param);
                    $('#JudgeWarning').text("");
                    $("#JudgeTable tbody  tr").remove();
                    tournament=temporary.name;
                    group=temporary.actualgroup;
                    horse=temporary.actualhorse;

                    $('#JudgeTable').append('<tr><td>' + temporary.name + '</td><td>' + temporary.city + '</td><td>' + temporary.groups + '</td><td>' + temporary.actualgroup + '</td><td>' + temporary.actualhorse + '</td><td><select id="type" onchange="changedetected()"><option value="rate">rate</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="head" onchange="changedetected()"><option value="rate">rate</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="clog" onchange="changedetected()"><option value="rate">rate</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="legs" onchange="changedetected()"><option value="rate">rate</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select  id="movement" onchange="changedetected()"><option value="rate">rate</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td></tr>');
                    
                    actualstring=temporary.name+temporary.groups+temporary.horses;
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
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    var rate="rate";
    if (ratings.type===rate||ratings.head===rate||ratings.clog===rate||ratings.legs===rate||ratings.movement===rate)
    {
    console.log("please mark all parameters");
    }else {
        socket.emit("NewRatingServer", ratings);

    }
}

