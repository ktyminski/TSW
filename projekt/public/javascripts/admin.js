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

            $('#HorseListTable').append('<tr><td>' + horsetemp.name + '</td><td>' + horsetemp.sex + '</td><td>' + horsetemp.owner + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><input type="button" value="Edit Horse" id="EditHorseButton'+horsetemp.name+'"  class="btn btn-danger" ></button></td><td><button type="button" id="DeleteHorseButton" onclick="function() {  }" class="btn btn-warning " >Delete</button></td></tr>');

            actualhorselist.push(horsetemp.name);
        }
    });

    $("#addHorseButton").click( function () {

        var newHorse = {name:$("#nameInput").val(), sex:$("#sexInput").val(), owner:$("#ownerInput").val()};
        socket.emit("newHorse", newHorse);
        socket.emit('RefreshList');

});
    socket.on("deletedJudge", function(){
        $("#JudgeListTable tbody  tr").remove();
        actualjudgelist = [];
        socket.emit('RefreshJudgeList');
    });
    $('#JudgeListTable').on('click', '#DeleteJudgeButton', function() {
        var judgecode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteJudge", judgecode);

    });
    socket.on("deletedHorse", function(){
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
        socket.emit('RefreshList');
    });

    socket.on("addingJudge", function(judgetemp) {

        if ($.inArray(judgetemp.code, actualjudgelist) !== -1) {

        }
        else {
            $('#JudgeListTable').append('<tr><td>' + judgetemp.code + '</td><td>' + judgetemp.name + '</td><td>' + judgetemp.surname + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-danger" >Edit Judge</button></td><td><button id ="DeleteJudgeButton" type="button" onclick="function () {  }" class="btn btn-warning " >Delete</button></td></tr>');

            actualjudgelist.push(judgetemp.code);
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
   $('#HorseListTable').on('click', '.btn.btn-danger', function () {
        var name = $(this).closest('tr').find('td:eq(0)').text();
        $(this).closest('tr').find('td:eq(0)').html('<input id="input1" type="text" value="'+name+'" />');
        var sex = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').find('td:eq(1)').html('<input id="input2" type="text" value="'+sex+'" />');
        var owner = $(this).closest('tr').find('td:eq(2)').text();
        $(this).closest('tr').find('td:eq(2)').html('<input id="input3" type="text" value="'+owner+'" />');

       var temp = '#EditHorseButton'+name;
        $(temp).val("Save");
        $(temp).click(function(){
            var newname = $('#input1').val();
            var newsex = $('#input2').val();
            var newowner = $('#input3').val();
        var UpdateHorse = {id: name, name:newname, sex:newsex, owner:newowner};
        console.log(UpdateHorse);

        socket.emit("UpdateHorse", UpdateHorse);

        });
   });


    $("#NewTournamentButton").click( function () {
        var newTournament = {name:$("#TournamentNameInput").val(), city:$("#TournamentCityInput").val(), number:$("#TournamentIdInput").val(), horses:$("#TournamentHorseInput"), judges:$("#TournamentJudgeInput")};
        socket.emit("newTournament", newTournament);
        socket.emit('RefreshTournamentList');



     });
});