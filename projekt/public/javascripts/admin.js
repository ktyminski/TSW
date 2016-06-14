/**
 * Created by Karol on 30.05.2016.
 */
/* global io: true */
/* globals $:false */
/* globals console:false*/


$(function(){
    "use strict";


    var socket;
    var actualhorselist = [];
    var actualjudgelist = [];
    var horsetab = [];  //tablica do dodawania koni do grup
    var judgetab = [];  //  ------------------ sedziow -----
        var grouptab = [];
            // var tournamenttab = [];
    var actualtournamentlist =[];
    var actualatournamentlist =[];
    var actualgrouplist =[];



    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }

    socket.emit('RefreshList');
    socket.emit('RefreshJudgeList');
    socket.emit('RefreshGroupList');
    socket.emit('RefreshTournamentList');
    socket.emit('RefreshaTournamentList');
    var tourlisttable= $('#aTournamentListTable');
    var horselisttable=$('#HorseListTable');
    var grouplisttable=$('#GroupListTable');
    var judgelisttable= $('#JudgeListTable');
    var grouptourtable= $('#GroupTournamentTable');
    var horsegrouptable=$('#HorseGroupTable');
    var judgegrouptable=$('#JudgeGroupTable');
    var ourlisttable=$('#TournamentListTable')


/////////////////////////////////////////////////////////////////////////////////////dodawanie
    socket.on("addingHorse", function(horsetemp) {

        if ($.inArray(horsetemp.name, actualhorselist) !== -1) {
            console.log();

        }
        else {

            horselisttable.append('<tr><td>' + horsetemp.name + '</td><td>' + horsetemp.sex + '</td><td>' + horsetemp.owner + '</td> <td><button type="button" id="#addHorseGroupButton'+horsetemp.name+'" class="btn btn-info " >Add to next group</button></td> <td><input type="button" value="Edit Horse" id="EditHorseButton'+horsetemp.name+'"  class="btn btn-danger" ></button></td><td><button type="button" id="DeleteHorseButton"  class="btn btn-warning " >Delete</button></td></tr>');
                
            actualhorselist.push(horsetemp.name);
        }
    });

    $("#addHorseButton").click( function () {

        var newHorse = {name:$("#nameInput").val(), sex:$("#sexInput").val(), owner:$("#ownerInput").val()};
        socket.emit("newHorse", newHorse);
        socket.emit('RefreshList');

});
    socket.on("deletedJudge", function(){
       judgelisttable.find("tbody").find("tr").remove();
        actualjudgelist = [];
        socket.emit('RefreshJudgeList');
    });
    socket.on("deletedaTournament", function(){
        tourlisttable.find("tbody").find("tr").remove();
        actualatournamentlist = [];
        socket.emit('RefreshaTournamentList');
    });
    judgelisttable.on('click', '#DeleteJudgeButton', function() {
        var judgecode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteJudge", judgecode);

    });
    socket.on("deletedHorse", function(){
        judgelisttable.find("tbody").find("tr").remove();
        actualjudgelist = [];
        socket.emit('RefreshJudgeList');
    });
    horselisttable.on('click', '#DeleteHorseButton', function() {
        var horsecode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteHorse", horsecode);
    });
    tourlisttable.on('click', '.btn.btn-success', function() {
            var horsecode = $(this).closest('tr').find('td:eq(0)').text();
            socket.emit("deleteaTournament", horsecode);

    });
    socket.on("deletedHorse", function(){
       horselisttable.find("tbody").find("tr").remove();
        actualhorselist = [];
        socket.emit('RefreshList');
    });
    $('#ClearScore').click( function () {
        socket.emit('deleteScores');
    });
    socket.on("addingJudge", function(judgetemp) {

        if ($.inArray(judgetemp.code, actualjudgelist) !== -1) {
            console.log();
        }
        else {
            judgelisttable.append('<tr><td>' + judgetemp.code + '</td><td>' + judgetemp.name + '</td><td>' + judgetemp.surname + '</td> <td><button type="button" id="#addJudgeGroupButton'+judgetemp.code+'" class="btn btn-info " >Add to next group</button></td> <td><input type="button" value="Edit Judge" id="EditJudgeButton'+judgetemp.code+'"  class="btn btn-danger" ><td><button id ="DeleteJudgeButton" type="button"  class="btn btn-warning " >Delete</button></td></tr>');

            actualjudgelist.push(judgetemp.code);
        }
    });
    $("#NewJudgeButton").click( function () {
        var newJudge = {name:$("#JudgeNameInput").val(), surname:$("#JudgeSurnameInput").val(),code:$("#JudgeCodeInput").val()};
        socket.emit("newJudge", newJudge);
        socket.emit('RefreshJudgeList');

    });
///////////////////////////////////////////////////////////////////////group
    socket.on("addingGroup", function(grouptemp) {

            if ($.inArray(grouptemp.name, actualgrouplist) !== -1) {
                console.log();
            }
            else {
                $('#GroupListTable').append('<tr><td>' + grouptemp.name + '</td><td>' + grouptemp.type + '</td><td>' + grouptemp.horses + '</td><td>' + grouptemp.judges + '</td><td><button type="button" id="#addTournamentGroupButton'+grouptemp.name+'" class="btn btn-info" >Add to next tournament</button><td><button type="button" id="DeleteGroupButton"  class="btn btn-warning " >Delete</button></td></tr>');

                actualgrouplist.push(grouptemp.name);
            }
        });
    $("#NewGroupButton").click( function () {
            var newGroup = {
                name: $("#GroupNameInput").val(),
                type: $("#GroupTypeInput").val(),
                horses: horsetab,
                judges: judgetab
            };
            horsetab=[];
            judgetab=[];
        socket.emit("newGroup", newGroup);
        socket.emit('RefreshGroupList');
           horsegrouptable.find("tbody").find("tr").remove();
            judgegrouptable.find("tbody").find("tr").remove();

    });
    grouplisttable.on('click', '#DeleteGroupButton', function() {
        var groupcode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteGroup", groupcode);

    });
    socket.on("deletedGroup", function(){
        grouplisttable.find("tbody").find("tr").remove();
        actualgrouplist = [];
        socket.emit('RefreshGroupList');
    });
 /////////////////////////////////////////////////////////////////////////////////////////////tournament
    socket.on("addingTournament", function(tournamenttemp) {

        if ($.inArray(tournamenttemp.name, actualtournamentlist) !== -1){
            console.log("");

        }
        else {
            $('#TournamentListTable').append('<tr><td>' + tournamenttemp.name + '</td><td>' + tournamenttemp.city + '</td><td>' + tournamenttemp.groups + '</td><td><button type="button" id="#addtoTournamentButton'+tournamenttemp.name+'" class="btn btn-info" >Start Tournament</button><td><button type="button" id="DeleteTournamentButton"  class="btn btn-warning " >Delete Tournament</button></td></tr>');

            actualtournamentlist.push(tournamenttemp.name);
        }
    });

    $("#NewTournamentButton").click( function () {
        var newTournament = {
            name: $("#TournamentNameInput").val(),
            city: $("#TournamentCityInput").val(),
            groups: grouptab

        };
        grouptab=[];
        socket.emit("newTournament", newTournament);
        socket.emit('RefreshTournamentList');
        $('#GroupTournamentTable').find("tbody").find("tr").remove();

    });
    $('#TournamentListTable').on('click', '#DeleteTournamentButton', function() {
        var tournamentcode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteTournament", tournamentcode);

    });
    $('#TournamentListTable').on('click', '#addTournamentButton', function() {
        var tournamentcode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteTournament", tournamentcode);

    });
    socket.on("deletedTournament", function(){
        $("#TournamentListTable").find("tbody").find("tr").remove();
        actualtournamentlist =[];
        socket.emit('RefreshTournamentList');
    });
    socket.on("deletedaTournament", function(){
        $("#aTournamentListTable").find("tbody").find("tr").remove();
        actualatournamentlist =[];
        socket.emit('RefreshaTournamentList');
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    horselisttable.on('click', '.btn.btn-danger', function () {
        var name = $(this).closest('tr').find('td:eq(0)').text();
        //$(this).closest('tr').find('td:eq(0)').html('<input id="input1" type="text" value="'+name+'" />');
        var sex = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').find('td:eq(1)').html('<input id="input2" type="text" value="'+sex+'" />');
        var owner = $(this).closest('tr').find('td:eq(2)').text();
        $(this).closest('tr').find('td:eq(2)').html('<input id="input3" type="text" value="'+owner+'" />');

       var temp = '#EditHorseButton'+name;
        $(temp).val("Save");
        $(temp).click(function(){

            var newsex = $('#input2').val();
            var newowner = $('#input3').val();
        var UpdateHorse = {id: name, name:name, sex:newsex, owner:newowner};
        console.log(UpdateHorse);

        socket.emit("UpdateHorse", UpdateHorse);
           

        });
   });
    judgelisttable.on('click', '.btn.btn-danger', function () {
        var code = $(this).closest('tr').find('td:eq(0)').text();
       // $(this).closest('tr').find('td:eq(0)').html('<input id="input1" type="text" value="'+code+'" />');
        var name = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').find('td:eq(1)').html('<input id="input2" type="text" value="'+name+'" />');
        var surname = $(this).closest('tr').find('td:eq(2)').text();
        $(this).closest('tr').find('td:eq(2)').html('<input id="input3" type="text" value="'+surname+'" />');

        var temp = '#EditJudgeButton'+code;
        $(temp).val("Save");
        $(temp).click(function(){
            var newname = $('#input2').val();
            var newsurname = $('#input3').val();
            var UpdateJudge = {id:code, code:code, name:newname, surname:newsurname};
            console.log(UpdateJudge);

            socket.emit("UpdateJudge", UpdateJudge);

        });
    });
    horselisttable.on('click', '.btn.btn-info', function () {

        var name = $(this).closest('tr').find('td:eq(0)').text();
        var sex = $(this).closest('tr').find('td:eq(1)').text();
        var owner = $(this).closest('tr').find('td:eq(2)').text();


        if ($.inArray(name, horsetab) !== -1){
            console.log();

        }else {
            $('#HorseGroupTable').append('<tr><td>' + name + '</td><td>' + sex + '</td><td>' + owner + '</td> <td><button type="button" id="#deleteHorseGroupButton' + name + '" class="btn btn-info " >Delete</button></td></tr>');
            horsetab.push(name);
        }

    });
    judgelisttable.on('click', '.btn.btn-info', function () {
        var code = $(this).closest('tr').find('td:eq(0)').text();
        var name = $(this).closest('tr').find('td:eq(1)').text();
        var surname = $(this).closest('tr').find('td:eq(2)').text();
        if ($.inArray(code, judgetab) !== -1){
            console.log();

        }else {
        $('#JudgeGroupTable').append('<tr><td>' +code + '</td><td>' + name + '</td><td>' + surname + '</td> <td><button type="button" id="#deleteJudgeGroupButton'+name+'" class="btn btn-info " >Delete</button></td></tr>');
            judgetab.push(code);
        }

    });
   grouplisttable.on('click', '.btn.btn-info', function () {
        var name = $(this).closest('tr').find('td:eq(0)').text();
        var type = $(this).closest('tr').find('td:eq(1)').text();
        var horses = $(this).closest('tr').find('td:eq(2)').text();
        var judges = $(this).closest('tr').find('td:eq(3)').text();
        if ($.inArray(name, grouptab) !== -1){
            console.log();

        }else {
            $('#GroupTournamentTable').append('<tr><td>' +name + '</td><td>' + type + '</td><td>' + horses + '</td><td>' + judges + '</td> <td><button type="button" id="#deleteGroupTournamentButton'+name+'" class="btn btn-info " >Delete</button></td></tr>');
            grouptab.push(name);
        }

    });
    socket.on("addingaTournament", function(atourtemp) {

            if ($.inArray(atourtemp.name, actualatournamentlist) !== -1) {
                console.log();

            }
            else {

                tourlisttable.append('<tr><td>' + atourtemp.name + '</td><td>' + atourtemp.city + '</td><td>' + atourtemp.groups + '</td> <td>' + atourtemp.actualgroup + '</td><td>' + atourtemp.actualhorse + '</td><td><button type="button" id="#addHorseGroupButton'+atourtemp.name+'" class="btn btn-info " >Next group</button></td> <td><button type="button" id="DeleteHorseButton"  class="btn btn-warning " >Next Horse</button></td><td><button type="button" id="DeleteHorseButton" class="btn btn-danger " >Hurry Judges</button></td><td><button type="button" id="DeleteHorseButton"  class="btn btn-success " >Close tournament</button></td></tr>');

                actualatournamentlist.push(atourtemp.name);
            }
        });
    socket.on("addingaTournament", function(atourtemp) {

        if ($.inArray(atourtemp.name, actualatournamentlist) !== -1) {
            console.log();
        }
        else {

            tourlisttable.append('<tr><td>' + atourtemp.name + '</td><td>' + atourtemp.city + '</td><td>' + atourtemp.groups + '</td> <td>' + atourtemp.actualgroup + '</td><td>' + atourtemp.actualhorse + '</td><td><button type="button" id="#addHorseGroupButton'+atourtemp.name+'" class="btn btn-info " >Next group</button></td> <td><button type="button" id="DeleteHorseButton"  class="btn btn-warning " >Next Horse</button></td><td><button type="button" id="DeleteHorseButton" " class="btn btn-danger " >Hurry Judges</button></td><td><button type="button" id="DeleteHorseButton"  class="btn btn-success " >Close tournament</button></td></tr>');

            actualatournamentlist.push(atourtemp.name);
           
        }
    });
//////////////////////////////////////////////////////////////////////////////////////////////wyswietlanie u admina aktualnych grup i koni
    ourlisttable.on('click', '.btn.btn-info', function () {

        var name = $(this).closest('tr').find('td:eq(0)').text();
        var city = $(this).closest('tr').find('td:eq(1)').text();
        var groups = $(this).closest('tr').find('td:eq(2)').text();
         socket.emit('AddRecords',name,city,groups);
    });
    socket.on("FinalAddingTour", function(name,city,groups,tourgroup, tourhorse, tourjudge) {


            var newaTournament = {name:name, city:city, groups:groups ,actualgroup:tourgroup, actualhorse:tourhorse, judges:tourjudge};
            socket.emit("newaTournament", newaTournament);
            socket.emit('RefreshaTournamentList');
           // socket.emit("JudgeMarks",tourjudge);

        });
    // $('#TournamentListTable').on('click', '.btn.btn-success', function () {
    //
    //
    //     var newaTournament = {name:name, city:city, groups:groups ,actualgroup:actualgroup, actualhorse:actualhorse};
    //     socket.emit("newaTournament", newaTournament);
    //     socket.emit('RefreshaTournamentList');
    //
    // });
///////////////////////////////////////////aktualny tournament ///////////////konie

    tourlisttable.on('click', '.btn.btn-warning', function () {

        var name = $(this).closest('tr').find('td:eq(0)').text();
        var city = $(this).closest('tr').find('td:eq(1)').text();
        var groups = $(this).closest('tr').find('td:eq(2)').text();
        var actualgroup = $(this).closest('tr').find('td:eq(3)').text();
        var actualhorse = $(this).closest('tr').find('td:eq(4)').text();
        socket.emit("NextActualHorse",name, city, groups, actualgroup, actualhorse);


    });
    tourlisttable.on('click', '.btn.btn-danger', function () {

        var name = $(this).closest('tr').find('td:eq(0)').text();
        var city = $(this).closest('tr').find('td:eq(1)').text();
        var groups = $(this).closest('tr').find('td:eq(2)').text();
        var actualgroup = $(this).closest('tr').find('td:eq(3)').text();
        var actualhorse = $(this).closest('tr').find('td:eq(4)').text();
        socket.emit("NextActualWarning",name, city, groups, actualgroup, actualhorse);


    });
    ////////////////////////////////////////////////////grupy
    tourlisttable.on('click', '.btn.btn-info', function func() {
        var name = $(this).closest('tr').find('td:eq(0)').text();
        var city = $(this).closest('tr').find('td:eq(1)').text();
        var groups = $(this).closest('tr').find('td:eq(2)').text();
        var actualgroup = $(this).closest('tr').find('td:eq(3)').text();
        var actualhorse = $(this).closest('tr').find('td:eq(4)').text();
        socket.emit("NextActualGroup",name, city, groups, actualgroup, actualhorse);

    });
    socket.on("UpdatingaTour", function(name,city,groups,tourgroup, tourhorse, tourjudge) {
        //var element=tourgroup;
        //var element2=tourhorse;
        //var actualgroup =0;
        // var actualhorse =0;

        var newaTournament = {name:name, city:city, groups:groups ,actualgroup:tourgroup, actualhorse:tourhorse, judges:tourjudge};
        socket.emit("newaTournament", newaTournament);
        socket.emit('RefreshaTournamentList');



    });
    socket.on("NextGroup",function(name,city,groups, actualgroup, tourhorse, tourjudge) {
        var UpdateaTournament = {name:name, actualgroup:actualgroup, actualhorse:tourhorse, judges:tourjudge };
        socket.emit("UpdateaTournament", UpdateaTournament);
    });
    grouptourtable.on('click', '.btn.btn-info', function func() {
        var deletion = $(this).closest("tr");
        deletion.remove();

    });
    horsegrouptable.on('click', '.btn.btn-info', function func() {
        var deletion = $(this).closest("tr");
        deletion.remove();

    });
    judgegrouptable.on('click', '.btn.btn-info', function func() {
        var deletion = $(this).closest("tr");
        deletion.remove();

    });


});