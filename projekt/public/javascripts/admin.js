/**
 * Created by Karol on 30.05.2016.
 */
$(function(){


    var socket;
    var actualhorselist = [];


    if (!socket || !socket.connected) {
        socket = io({forceNew: true});
    }

    socket.emit('RefreshList');
    
    
    socket.on("addingHorse", function(horsetemp) {
        if ($.inArray(horsetemp.name, actualhorselist) !== -1)
        {
            //cos tutaj bedzie sie dzialo
        }
        else
        {
            $('#HorseListTable').append('<tr><td>' + horsetemp.name + '</td><td>' + horsetemp.sex + '</td><td>' + horsetemp.owner + '</td> <td><button type="button" class="btn btn-default " >Add to next tournament</button></td> <td><button type="button" class="btn btn-default" >Edit Horse</button></td><td><button type="button" class="btn btn-default " >Delete</button></td></tr>');

            actualhorselist.push(horsetemp.name);
        }
    });

    $("#addHorseButton").click( function ()
    {
        var newHorse = {name:$("#nameInput").val(), sex:$("#sexInput").val(), owner:$("#ownerInput").val()};
        socket.emit("newHorse", newHorse);
        socket.emit('RefreshList');
        
    });







});