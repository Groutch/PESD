let socket = io.connect();

$('#answer').keyup(()=>{
	socket.emit('answer' , {answer : $('#answer').val()})
});

socket.on('answer' , data => {
	$('#answer').text(data.answer);
})