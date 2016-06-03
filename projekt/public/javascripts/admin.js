/**
 * Created by Karol on 30.05.2016.
 */

$(function(){


    var socket;
    var actualhorselist = [];
    var actualjudgelist = [];
    var horsetab = [];  //tablica do dodawania koni do grup
    var judgetab = [];  //  ------------------ sedziow -----
    var actualturnamentlist =[];
    var actualgrouplist =[];


    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }

    socket.emit('RefreshList');
    socket.emit('RefreshJudgeList');
    socket.emit('RefreshGroupList');

/////////////////////////////////////////////////////////////////////////////////////dodawanie
    socket.on("addingHorse", function(horsetemp) {

        if ($.inArray(horsetemp.name, actualhorselist) !== -1) {

        }
        else {

            $('#HorseListTable').append('<tr><td>' + horsetemp.name + '</td><td>' + horsetemp.sex + '</td><td>' + horsetemp.owner + '</td> <td><button type="button" id="#addHorseGroupButton'+horsetemp.name+'" class="btn btn-info " >Add to next group</button></td> <td><input type="button" value="Edit Horse" id="EditHorseButton'+horsetemp.name+'"  class="btn btn-danger" ></button></td><td><button type="button" id="DeleteHorseButton" onclick="function() {  }" class="btn btn-warning " >Delete</button></td></tr>');

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
            $('#JudgeListTable').append('<tr><td>' + judgetemp.code + '</td><td>' + judgetemp.name + '</td><td>' + judgetemp.surname + '</td> <td><button type="button" id="#addJudgeGroupButton'+judgetemp.code+'" class="btn btn-info " >Add to next group</button></td> <td><input type="button" value="Edit Judge" id="EditJudgeButton'+judgetemp.code+'"  class="btn btn-danger" ><td><button id ="DeleteJudgeButton" type="button" onclick="function () {  }" class="btn btn-warning " >Delete</button></td></tr>');

            actualjudgelist.push(judgetemp.code);
        }
    });


    $("#NewJudgeButton").click( function ()
    {
        var newJudge = {name:$("#JudgeNameInput").val(), surname:$("#JudgeSurnameInput").val(),code:$("#JudgeCodeInput").val()};
        socket.emit("newJudge", newJudge);
        socket.emit('RefreshJudgeList');

    });

    socket.on("addingGroup", function(grouptemp) {

        if ($.inArray(grouptemp.name, actualgrouplist) !== -1) {

        }
        else {
            $('#GroupListTable').append('<tr><td>' + grouptemp.name + '</td><td>' + grouptemp.type + '</td><td>' + grouptemp.horses + '</td><td>' + grouptemp.judges + '</td><td><button type="button" id="#addTournamentGroupButton'+grouptemp.name+'" class="btn btn-info" >Add to next tournament</button><td><button type="button" id="DeleteGroupButton" onclick="function() {  }" class="btn btn-warning " >Delete</button></td></tr>');

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
        socket.emit("newGroup", newGroup);
        socket.emit('RefreshGroupList');
    });

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

    $('#JudgeListTable').on('click', '.btn.btn-danger', function () {
        var code = $(this).closest('tr').find('td:eq(0)').text();
        $(this).closest('tr').find('td:eq(0)').html('<input id="input1" type="text" value="'+code+'" />');
        var name = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').find('td:eq(1)').html('<input id="input2" type="text" value="'+name+'" />');
        var surname = $(this).closest('tr').find('td:eq(2)').text();
        $(this).closest('tr').find('td:eq(2)').html('<input id="input3" type="text" value="'+surname+'" />');

        var temp = '#EditJudgeButton'+code;
        $(temp).val("Save");
        $(temp).click(function(){
            var newcode = $('#input1').val();
            var newname = $('#input2').val();
            var newsurname = $('#input3').val();
            var UpdateJudge = {id:code, code:newcode, name:newname, surname:newsurname};
            console.log(UpdateJudge);

            socket.emit("UpdateJudge", UpdateJudge);

        });
    });
    $('#GroupListTable').on('click', '#DeleteGroupButton', function() {
        var groupcode = $(this).closest('tr').find('td:eq(0)').text();
        socket.emit("deleteGroup", groupcode);

    });
    socket.on("deletedGroup", function(){
        $("#GroupListTable tbody  tr").remove();
        actualgrouplist = [];
        socket.emit('RefreshGroupList');
    });


    $("#NewTournamentButton").click( function () {
        var newTournament = {name:$("#TournamentNameInput").val(), city:$("#TournamentCityInput").val(), number:$("#TournamentIdInput").val(), groups:$("#TournamentHorseInput")};
        socket.emit("newTournament", newTournament);
        socket.emit('RefreshTournamentList');



     });

    $('#HorseListTable').on('click', '.btn.btn-info', function () {

        var name = $(this).closest('tr').find('td:eq(0)').text();
        var sex = $(this).closest('tr').find('td:eq(1)').text();
        var owner = $(this).closest('tr').find('td:eq(2)').text();


        if ($.inArray(name, horsetab) !== -1){

        }else {
            $('#HorseGroupTable').append('<tr><td>' + name + '</td><td>' + sex + '</td><td>' + owner + '</td> <td><button type="button" id="#deleteHorseGroupButton' + name + '" class="btn btn-info " >Delete</button></td></tr>');
            horsetab.push(name);
        }

    });
    $('#JudgeListTable').on('click', '.btn.btn-info', function () {
        var code = $(this).closest('tr').find('td:eq(0)').text();
        var name = $(this).closest('tr').find('td:eq(1)').text();
        var surname = $(this).closest('tr').find('td:eq(2)').text();
        if ($.inArray(code, judgetab) !== -1){

        }else {
        $('#JudgeGroupTable').append('<tr><td>' +code + '</td><td>' + name + '</td><td>' + surname + '</td> <td><button type="button" id="#deleteJudgeGroupButton'+name+'" class="btn btn-info " >Delete</button></td></tr>');
            judgetab.push(code);
        }

    });
});