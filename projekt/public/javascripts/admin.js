/**
 * Created by Karol on 30.05.2016.
 */
/*jshint browser: true, globalstrict: true, devel: true */
/*global io: false */
$(function(){


    var socket;
    var actualhorselist = [];
    var actualjudgelist = [];


    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }

    socket.emit('RefreshList');
    socket.emit('RefreshJudgeList');
    
    
    socket.on("addingHorse", function(horsetemp) {

        if ($.inArray(horsetemp.name, actualhorselist) !== -1) {

        }
        else {
            $('#HorseListTable').append('<tr><td>' + horsetemp.name + '</td><td>' + horsetemp.sex + '</td><td>' + horsetemp.owner + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-default" >Edit Horse</button></td><td><button type="button" class="btn btn-default " >Delete</button></td></tr>');
           
            actualhorselist.push(horsetemp.name);
        }
    });

    $("#addHorseButton").click( function () {
        var newHorse = {name:$("#nameInput").val(), sex:$("#sexInput").val(), owner:$("#ownerInput").val()};
        socket.emit("newHorse", newHorse);
        socket.emit('RefreshList');

});
    $("#deleteJudgeButton").click( function () {
        var newJudge = {name:$("#JudgeNameInput").val(), surname:$("#JudgeSurnameInput").val(),code:$("#JudgeCodeInput").val()};
        socket.emit("deleteJudge", newJudge);
        socket.emit('RefreshJudgeList');
        alert("Deleted record");
    });

    socket.on("addingJudge", function(judgetemp) {

        if ($.inArray(judgetemp.name, actualjudgelist) !== -1) {

        }
        else {
            $('#JudgeListTable').append('<tr><td>' + judgetemp.name + '</td><td>' + judgetemp.surname + '</td><td>' + judgetemp.code + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-default" >Edit Judge</button></td><td><button type="button" class="btn btn-default " >Delete</button></td></tr>');

            actualjudgelist.push(judgetemp.name);
        }
    });

    $("#NewJudgeButton").click( function ()
    {
        var newJudge = {name:$("#JudgeNameInput").val(), surname:$("#JudgeSurnameInput").val(),code:$("#JudgeCodeInput").val()};
        socket.emit("newJudge", newJudge);
        socket.emit('RefreshJudgeList');

    });

    // socket.on("addingTournament", function(tournamenttemp) {
    //
    //     if ($.inArray(tournamenttemp.name, actualtournamentlist) !== -1) {
    //
    //     }
    //     else {
    //         $('#JudgeListTable').append('<tr><td>' + tournamenttemp.name + '</td><td>' + tournamenttemp.surname + '</td><td>' + tournamenttemp.code + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-default" >Edit Judge</button></td><td><button type="button" class="btn btn-default " >Delete</button></td></tr>');
    //
    //         actualjudgelist.push(judgetemp.name);
    //     }


    $("#NewTournamentButton").click( function ()
    {
        var newTournament = {name:$("#TournamentNameInput").val(), city:$("#TournamentCityInput").val(), number:$("#TournamentIdInput").val(), horses:$("#TournamentHorseInput"), judges:$("#TournamentJudgeInput")};
        socket.emit("newTournament", newTournament);
        socket.emit('RefreshTournamentList');



     });
});