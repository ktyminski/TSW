/**
 * Created by Karol on 30.05.2016.
 */
/* global io: true */
"use strict";

$(function(){

    var id;
    var actualscores=[];
    var actualscoresfinal=[];

    var socket;
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    
    socket.emit('RefreshScoreList');
    socket.emit('RefreshFinalScoreList');
    socket.on("showTable", function() {
        $('#ScoreTable').find("tbody").find("tr").remove();
        $('#FinalScoreTable').find("tbody").find("tr").remove();
        actualscores=[];
      //  countingarray=[];
      //  actualscoresfinal =[];
      //  counting=0;
      //  finalscore=[];

        socket.emit('RefreshScoreList');
        socket.emit('RefreshFinalScoreList');
    });
    socket.on("refrr", function() {
        $('#ScoreTable').find("tbody").find("tr").remove();
        $('#FinalScoreTable').find("tbody").find("tr").remove();
        actualscores=[];
     //  countingarray=[];

        socket.emit('RefreshScoreList');
        socket.emit('RefreshFinalScoreList');
    });
    // socket.on("counting", function(ratingtemp) {
    //
    //                 if ($.inArray(ratingtemp._id, actualscoresfinal) !== -1) {
    //                     console.log();
    //
    //
    //                 }
    //                 else {
    //                     actualscoresfinal.push(ratingtemp._id);
    //                     if (finalscore.includes(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse)){
    //
    //                         for (var i=0;i<countingarray.length;i++){
    //                             if(countingarray[i].tournament+countingarray[i].group+countingarray[i].horse===ratingtemp.tournament + ratingtemp.group + ratingtemp.horse){
    //                                 var value1=parseFloat(countingarray[i].type)+parseFloat(ratingtemp.type);
    //                                 var value2=parseFloat(countingarray[i].head)+parseFloat(ratingtemp.head);
    //                                 var value3=parseFloat(countingarray[i].clog)+parseFloat(ratingtemp.clog);
    //                                 var value4=parseFloat(countingarray[i].legs)+parseFloat(ratingtemp.legs);
    //                                 var value5=parseFloat(countingarray[i].movement)+parseFloat(ratingtemp.movement);
    //                                 var all=value1+value2+value3+value4+value5;
    //                                 countingarray[i].type=(value1);
    //                                 countingarray[i].head=(value2);
    //                                 countingarray[i].clog=(value3);
    //                                 countingarray[i].legs=(value4);
    //                                 countingarray[i].movement=(value5);
    //                                 countingarray[i].all=(all);
    //                                 countingarray[i].counter=countingarray[i].counter+1;
    //                                 break;
    //                             }
    //                         }
    //                     }else{
    //
    //
    //                         counting =({tournament:ratingtemp.tournament,group:ratingtemp.group, horse: ratingtemp.horse, type: ratingtemp.type ,head: ratingtemp.head , clog: ratingtemp.clog , legs: ratingtemp.legs ,movement: ratingtemp.movement,all:parseFloat(ratingtemp.type)+parseFloat(ratingtemp.head)+parseFloat(ratingtemp.clog)+parseFloat(ratingtemp.legs) +parseFloat(ratingtemp.movement), counter:1});
    //                         countingarray.push(counting);
    //
    //                         finalscore.push(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse);
    //
    //
    //                     }
    //                 }
    //
    //     var some=$('#FinalScoreTable');
    //    some.find("tbody").find("tr").remove();
    //     for (var j=0;j<countingarray.length;j++){
    //         some.append('<tr><td id="id'+countingarray[j].tournament+countingarray[j].group+countingarray[j].horse +'">' +countingarray[j].tournament + '</td><td>' +countingarray[j].group + '</td><td>' + countingarray[j].horse + '</td><td>' + countingarray[j].type/countingarray[j].counter + '</td><td>' + countingarray[j].head/countingarray[j].counter + '</td><td>' + countingarray[j].clog/countingarray[j].counter + '</td><td>' + countingarray[j].legs/countingarray[j].counter + '</td><td>' + countingarray[j].movement/countingarray[j].counter + '</td><td>' + countingarray[j].all/countingarray[j].counter + '</td></tr>');
    //         socket.emit("addfinalscores",counting);
    //
    //
    //     }
    //
    // });



    socket.on("addingScore", function(ratingtemp) {
        if ($.inArray(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ratingtemp.judge, actualscores) !== -1) {
            console.log();
            var aid="td#id"+ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge;
             $(aid).parent().replaceWith('<tr><td id="id' +ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge+'">' + ratingtemp.tournament + '</td><td>' +  ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' +  ratingtemp.type + '</td><td>' +  ratingtemp.head + '</td><td>' +  ratingtemp.clog + '</td><td>' +  ratingtemp.legs + '</td><td>' +  ratingtemp.movement  + '</td></tr>');

        }
        else {
            if (ratingtemp.type==="00" || ratingtemp.head==="00" || ratingtemp.clog==="00" || ratingtemp.legs==="00" || ratingtemp.movement==="00" ){
                console.log();
            }else{
            $('#ScoreTable').append('<tr><td id="id'+ratingtemp.tournament+ratingtemp.group+ratingtemp.horse+ratingtemp.judge+'">' + ratingtemp.tournament + '</td><td>' +ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + Number(ratingtemp.type) + '</td><td>' + Number(ratingtemp.head) + '</td><td>' + Number(ratingtemp.clog) + '</td><td>' + Number(ratingtemp.legs) + '</td><td>' + Number(ratingtemp.movement) + '</td></tr>');
            actualscores.push(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ratingtemp.judge);
            }

        }
    });

    socket.on("addingfinalScore", function(ratingfinal) {
        if ($.inArray(ratingfinal.tournament+ratingfinal.group+ ratingfinal.horse+ratingfinal.judge, ratingfinal) !== -1) {
            var aid="td#id"+ratingfinal.tournament+ratingfinal.group+ratingfinal.horse+ratingfinal.judge;
            $(aid).parent().replaceWith('<tr><td id="id' +ratingfinal.tournament+ratingfinal.group+ratingfinal.horse+ratingfinal.judge+'">' + ratingfinal.tournament + '</td><td>' +  ratingfinal.group + '</td><td>' + ratingfinal.horse + '</td><td>' +  ratingfinal.type + '</td><td>' +  ratingfinal.head + '</td><td>' +  ratingfinal.clog + '</td><td>' +  ratingfinal.legs + '</td><td>' +  ratingfinal.movement  + '</td></tr>');

        }
        else {

                $('#FinalScoreTable').append('<tr><td id="id'+ratingfinal.tournament+ratingfinal.group+ratingfinal.horse+ratingfinal.judge+'">' + ratingfinal.tournament + '</td><td>' +ratingfinal.group + '</td><td>' + ratingfinal.horse + '</td><td>' + Number(ratingfinal.type) + '</td><td>' + Number(ratingfinal.head) + '</td><td>' + Number(ratingfinal.clog) + '</td><td>' + Number(ratingfinal.legs) + '</td><td>' + Number(ratingfinal.movement) + '</td><td>' + Number(ratingfinal.all) + '</td></tr>');
                actualscoresfinal.push(ratingfinal.tournament+ratingfinal.group+ ratingfinal.horse+ratingfinal.judge);
            }


    });


});
(function(document) {

    var LightTableFilter = (function(Arr) {

        var _input;

        function _onInputEvent(e) {
            _input = e.target;
            var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
            Arr.forEach.call(tables, function(table) {
                Arr.forEach.call(table.tBodies, function(tbody) {
                    Arr.forEach.call(tbody.rows, _filter);
                });
            });
        }

        function _filter(row) {
            var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
            row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
        }

        return {
            init: function() {
                var inputs = document.getElementsByClassName('light-table-filter');
                Arr.forEach.call(inputs, function(input) {
                    input.oninput = _onInputEvent;
                });
            }
        };
    })(Array.prototype);

    document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
            LightTableFilter.init();
        }
    });

})(document);