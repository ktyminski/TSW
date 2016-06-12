/**
 * Created by Karol on 30.05.2016.
 */

$(function(){
    var actualscores=[];
    var actualscoresfinal =[];
    var finalscore=[];
    var counting;
    var countingarray=[];
    var socket;
    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }
    socket.emit('RefreshScoreList');
    socket.on("refr", function() {
        //$('#ScoreTable tbody  tr').remove();

  
        socket.emit('RefreshScoreList');
    });
    socket.on("refrr", function() {
        $('#ScoreTable tbody  tr').remove();
        $('#FinalScoreTable tbody  tr').remove();
        countingarray=[];

        socket.emit('RefreshScoreList');
    });
    socket.on("counting", function(ratingtemp) {

                    if ($.inArray(ratingtemp._id, actualscoresfinal) !== -1) {

                    }
                    else {
                        actualscoresfinal.push(ratingtemp._id);
                        if (finalscore.includes(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse)){
                            console.log(ratingtemp.tournament,ratingtemp.group ,ratingtemp.horse);
                            for (var i=0;i<countingarray.length;i++){
                                if(countingarray[i].tournament+countingarray[i].group+countingarray[i].horse===ratingtemp.tournament + ratingtemp.group + ratingtemp.horse){
                                    var value1=parseFloat(countingarray[i].type)+parseFloat(ratingtemp.type);
                                    var value2=parseFloat(countingarray[i].head)+parseFloat(ratingtemp.head);
                                    var value3=parseFloat(countingarray[i].clog)+parseFloat(ratingtemp.clog);
                                    var value4=parseFloat(countingarray[i].legs)+parseFloat(ratingtemp.legs);
                                    var value5=parseFloat(countingarray[i].movement)+parseFloat(ratingtemp.movement);
                                    var all=value1+value2+value3+value4+value5;
                                    countingarray[i].type=(value1);
                                    countingarray[i].head=(value2);
                                    countingarray[i].clog=(value3);
                                    countingarray[i].legs=(value4);
                                    countingarray[i].movement=(value5);
                                    countingarray[i].all=(all);
                                    countingarray[i].counter= countingarray[i].counter+1;
                                    console.log(countingarray[i]);
                                    console.log(countingarray.length);
                                }
                            }

                        }else{

                            counting =({tournament:ratingtemp.tournament,group:ratingtemp.group, horse: ratingtemp.horse, type: ratingtemp.type ,head: ratingtemp.head , clog: ratingtemp.clog , legs: ratingtemp.legs ,movement: ratingtemp.movement,all:parseFloat(ratingtemp.type)+parseFloat(ratingtemp.head)+parseFloat(ratingtemp.clog)+parseFloat(ratingtemp.legs) +parseFloat(ratingtemp.movement), counter:1});
                            countingarray.push(counting);
                            finalscore.push(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse);

                        }
                    }
        $('#FinalScoreTable tbody  tr').remove();
        for (var i=0;i<countingarray.length;i++){
            $('#FinalScoreTable').append('<tr><td>' + (countingarray[i].tournament) + '</td><td>' +countingarray[i].group + '</td><td>' + countingarray[i].horse + '</td><td>' + countingarray[i].type/countingarray[i].counter + '</td><td>' + countingarray[i].head/countingarray[i].counter + '</td><td>' + countingarray[i].clog/countingarray[i].counter + '</td><td>' + countingarray[i].legs/countingarray[i].counter + '</td><td>' + countingarray[i].movement/countingarray[i].counter + '</td><td>' + countingarray[i].all/countingarray[i].counter + '</td></tr>');

        }

    });



    socket.on("addingScore", function(ratingtemp) {
        if ($.inArray(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ ratingtemp.type + ratingtemp.head+ ratingtemp.clog+ ratingtemp.legs+ ratingtemp.movement , actualscores) !== -1) {

        }
        else {

            $('#ScoreTable').append('<tr><td>' + ratingtemp.tournament + '</td><td>' +ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + ratingtemp.type + '</td><td>' + ratingtemp.head + '</td><td>' + ratingtemp.clog + '</td><td>' + ratingtemp.legs + '</td><td>' + ratingtemp.movement + '</td></tr>');
            actualscores.push(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ ratingtemp.type + ratingtemp.head+ ratingtemp.clog+ ratingtemp.legs+ ratingtemp.movement);
        }
    });




});
(function(document) {
    'use strict';

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