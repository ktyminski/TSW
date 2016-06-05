/**
 * Created by Karol on 30.05.2016.
 */

$(function() {

    var socket;
    var param;
    var tt;

    $('#loginButton').click( function () {
       param = $('#codeInput').val();
       alert(tt);
       //  for (i=0;i<tt.length;i++) {
       //      if (param === tt[i - 1]) {
       //          socket.emit('RefreshJudgePanel', tt);
       //      }
       //  }

    });
   
    

    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    //socket.emit('RefreshJudgePanel');
    
    socket.on("CheckJudge", function (tourjudge) {
        alert(param);
        tt=tourjudge;
        for (i=0;i<tourjudge.length;i++)
        {
            if (param === tourjudge[i-1]){
                socket.emit('RefreshJudgePanel',tourjudge);
            }
        }
    });
    

    socket.on("addingJudgePanel", function (temporary,tourjudge) {

                $('#LoggedAS').text(param);
                $('#JudgeTable').append('<tr><td>' + temporary.name + '</td><td>' + temporary.city + '</td><td>' + temporary.groups + '</td><td>' + temporary.actualgroup + '</td><td>' + temporary.actualhorse + '</td><td><select id="type' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select><td><select id="head' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select id="clog' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select id="legs' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select id="movement' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><input id="rate' + temporary.name + '" class="btn btn-info" value="Proceed Ratings" type="button"></td></tr>');


    });

     socket.on("RatedHorse", function(temporary){
         $("#JudgeTable tbody  tr").remove();

    });


    $('#JudgeTable').on('click', '.btn.btn-info', function() {
        var tournament = $(this).closest('tr').find('td:nth-child(0)').text();
        var group = $(this).closest('tr').find('td:nth-child(3) option:selected').val();
        var horse = $(this).closest('tr').find('td:nth-child(4) option:selected').val();
        var judge = param;
        var type = $(this).closest('tr').find('td:nth-child(5) option:selected').val();
        var head = $(this).closest('tr').find('td:nth-child(6) option:selected').val();
        var clog = $(this).closest('tr').find('td:nth-child(7) option:selected').val();
        var legs = $(this).closest('tr').find('td:nth-child(8) option:selected').val();
        var movement = $(this).closest('tr').find('td:nth-child(9) option:selected').val();

        var ratings = {tournament: tournament, group: group, horse: horse, judge: judge, type:type, head:head, clog:clog, legs:legs, movement:movement};

        socket.emit("SendRating", ratings);

    });
 });

