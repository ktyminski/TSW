/**
 * Created by Karol on 30.05.2016.
 */

$(function() {

    var socket;
    var param;
    var tt;



    

    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    socket.emit('RefreshJudgePanel');
    
    socket.on("CheckJudge", function (name,tourjudge) {
        tt=tourjudge;
        param = $('#codeInput').val();



        for (i=0;i<tourjudge.length;i++) {

            if (param === tourjudge[i]) {

                socket.emit('RefreshJudgePanel', name, tourjudge);

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
    

    socket.on("addingJudgePanel", function (temporary,tourjudge) {
        
        for (i=0;i<tourjudge.length;i++)
        {

            if (param === tourjudge[i]){
                $('#LoggedAS').text(param);
                $('#JudgeWarning').text("");
                $("#JudgeTable tbody  tr").remove();

                    $('#JudgeTable').append('<tr><td>' + temporary.name + '</td><td>' + temporary.city + '</td><td>' + temporary.groups + '</td><td>' + temporary.actualgroup + '</td><td>' + temporary.actualhorse + '</td><td><select id="type' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select><td><select id="head' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select id="clog' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select id="legs' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><select id="movement' + temporary.name + '"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td><td><input id="rate" " class="btn btn-info" value="Proceed Ratings" type="button"></td></tr>');

                
            }
        }


    });

     socket.on("RatedHorse", function(temporary){
         $("#JudgeTable tbody  tr").remove();

    });


    $('#JudgeTable').on('click', '.btn.btn-info', function() {
        var tournament = $(this).closest('tr').find('td:eq(0)').text();
        var group = $(this).closest('tr').find('td:eq(3)').text();
        var horse = $(this).closest('tr').find('td:eq(4)').text();
        var judge = param;
        var type = $(this).closest('tr').find('td:eq(5) option:selected').val();
        var head = $(this).closest('tr').find('td:eq(6) option:selected').val();
        var clog = $(this).closest('tr').find('td:eq(7) option:selected').val();
        var legs = $(this).closest('tr').find('td:eq(8) option:selected').val();
        var movement = $(this).closest('tr').find('td:eq(9) option:selected').val();
        var unique=tournament+group+horse+judge;
        alert(unique);
        var ratings = {title:unique ,tournament: tournament, group: group, horse: horse, judge: judge, type:type, head:head, clog:clog, legs:legs, movement:movement};
        socket.emit("SendRating", ratings);
        var button = "#rate";
        $(button).val("Rated").prop('disabled', true);

    });
 });

