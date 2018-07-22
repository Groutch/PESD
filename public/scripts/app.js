$(document).ready(() => {

    if (typeof idP != 'undefined') {
        var socket = io("/" + idP);
        $("#answer").on("keyup", () => {
            var text = $("#answer").val().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(?:\r\n|\r|\n)/g, '<br>');
            socket.emit("message", {
                message: text
            });
        });

        $("#nextstep").on("click", () => {
            socket.emit("nextstep");
        });
        socket.on('nextstep', ()=>{
          $("#nextstepcli").click();
        });
        socket.on("message", data => {
            $("#answer").val(data.message);
            $("#answerM").html(data.message);
        });

    }else{
      console.log("pas de idP pour le socket");
    }
    $("#displayAccount").show();
    $("#formModifyAccount").hide();
    $("#askModInfos").click(() => {
        $("#displayAccount").hide();
        $("#formModifyAccount").show();
    });

});
