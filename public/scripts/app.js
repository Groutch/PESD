let socket = io.connect();

$("#displayAccount").show();
$("#formModifyAccount").hide();

$('#answer').keyup(()=>{
	socket.emit('answer' , {answer : $('#answer').val()})
});

socket.on('answer' , data => {
	$('#answer').text(data.answer);
});


$("#askModInfos").click(()=>{
    $("#displayAccount").hide();
    $("#formModifyAccount").show();
});