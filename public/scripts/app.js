var socket = io();

$("#displayAccount").show();
$("#formModifyAccount").hide();
$("#askModInfos").click(()=>{
    $("#displayAccount").hide();
    $("#formModifyAccount").show();
});

$('#answer').keyup(()=>{
	socket.emit('answer' , {answer : $('#answer').val()})
});

socket.on('answer' , data => {
	$('#answer').text(data.answer);
});


