/**
 * Created by Karol on 30.05.2016.
 */

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
            $('#HorseListTable').append('<tr><td>' + horsetemp.name + '</td><td>' + horsetemp.sex + '</td><td>' + horsetemp.owner + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-default" >Edit Horse</button></td><td><button type="button" id="DeleteHorseButton" onclick="function () {  }" class="btn btn-default " >Delete</button></td></tr>');

            actualhorselist.push(horsetemp.name);
        }
    });

    $("#addHorseButton").click( function () {

        var newHorse = {name:$("#nameInput").val(), sex:$("#sexInput").val(), owner:$("#ownerInput").val()};
        socket.emit("newHorse", newHorse);
        socket.emit('RefreshList');

});
    $('#JudgeListTable').on('click', '#DeleteJudgeButton', function() {
        var judgecode = $(this).closest('tr').find('td:eq(2)').text();
        socket.emit("deleteJudge", judgecode);

    });
    socket.on("deletedJudge", function(){
        $("#JudgeListTable tbody  tr").remove();
        actualjudgelist = [];
        socket.emit('RefreshJudgeList');
    });
    $('#HorseListTable').on('click', '#DeleteHorseButton', function() {
        var horsecode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteHorse", horsecode);

    });
    socket.on("deletedHorse", function(){
        $("#HorseListTable tbody  tr").remove();
        actualhorselist = [];
        socket.emit('RefreshHorseList');
    });

    socket.on("addingJudge", function(judgetemp) {

        if ($.inArray(judgetemp.name, actualjudgelist) !== -1) {

        }
        else {
            $('#JudgeListTable').append('<tr><td>' + judgetemp.name + '</td><td>' + judgetemp.surname + '</td><td>' + judgetemp.code + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-default" >Edit Judge</button></td><td><button id ="DeleteJudgeButton" type="button" onclick="function () {  }" class="btn btn-default " >Delete</button></td></tr>');

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