/**
 * Created by Karol on 30.05.2016.
 */
"use strict";
$(function(){
    var type = [];
    var head = [];
    var clog = [];
    var legs = [];
    var move = [];

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
    socket.on("showTable", function() {
        $('#ScoreTable tbody  tr').remove();
        $('#FinalScoreTable tbody  tr').remove();
        actualscores=[];
        countingarray=[];
        actualscoresfinal =[];
        counting=0;
        finalscore=[];

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
                        console.log();

                            // console.log(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse);
                          //  $("td#id" + ratingtemp.tournament + ratingtemp.group + ratingtemp.horse).parent().replaceWith('<tr><td id="id' +ratingtemp.tournament+ratingtemp.tournament+ratingtemp.horse+'">' + ratingtemp.tournament + '</td><td>' +  ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' +  ratingtemp.type + '</td><td>' +  ratingtemp.head + '</td><td>' +  ratingtemp.clog + '</td><td>' +  ratingtemp.legs + '</td><td>' +  ratingtemp.movement  + '</td><td>' +"11" +'</td></tr>');

                    }
                    else {
                        actualscoresfinal.push(ratingtemp._id);
                        if (finalscore.includes(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse)){

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
                                    countingarray[i].counter=countingarray[i].counter+1;
                                    console.log( countingarray[i].counter);
                                    break;
                                }
                            }
                        }else{

                            counting =({tournament:ratingtemp.tournament,group:ratingtemp.group, horse: ratingtemp.horse, type: ratingtemp.type ,head: ratingtemp.head , clog: ratingtemp.clog , legs: ratingtemp.legs ,movement: ratingtemp.movement,all:parseFloat(ratingtemp.type)+parseFloat(ratingtemp.head)+parseFloat(ratingtemp.clog)+parseFloat(ratingtemp.legs) +parseFloat(ratingtemp.movement), counter:1});
                            countingarray.push(counting);
                            finalscore.push(ratingtemp.tournament + ratingtemp.group + ratingtemp.horse);

                        }
                    }


        $('#FinalScoreTable tbody  tr').remove();
        for (var j=0;j<countingarray.length;j++){
            $('#FinalScoreTable').append('<tr><td id="id'+countingarray[j].tournament+countingarray[j].group+countingarray[j].horse +'">' +countingarray[j].tournament + '</td><td>' +countingarray[j].group + '</td><td>' + countingarray[j].horse + '</td><td>' + countingarray[j].type/countingarray[j].counter + '</td><td>' + countingarray[j].head/countingarray[j].counter + '</td><td>' + countingarray[j].clog/countingarray[j].counter + '</td><td>' + countingarray[j].legs/countingarray[j].counter + '</td><td>' + countingarray[j].movement/countingarray[j].counter + '</td><td>' + countingarray[j].all/countingarray[j].counter + '</td></tr>');

        }

    });



    socket.on("addingScore", function(ratingtemp) {
        if ($.inArray(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ratingtemp.judge, actualscores) !== -1) {
            console.log();

        }
        else {
            if (ratingtemp.type==="00" || ratingtemp.head==="00" || ratingtemp.clog==="00" || ratingtemp.legs==="00" || ratingtemp.movement==="00" ){
                console.log();
            }else{
            $('#ScoreTable').append('<tr><td>' + ratingtemp.tournament + '</td><td>' +ratingtemp.group + '</td><td>' + ratingtemp.horse + '</td><td>' + Number(ratingtemp.type) + '</td><td>' + Number(ratingtemp.head) + '</td><td>' + Number(ratingtemp.clog) + '</td><td>' + Number(ratingtemp.legs) + '</td><td>' + Number(ratingtemp.movement) + '</td></tr>');
            actualscores.push(ratingtemp.tournament+ratingtemp.group+ ratingtemp.horse+ratingtemp.judge);
            }

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