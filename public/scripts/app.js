$(document).ready(() => {

    if (typeof idP != 'undefined') {
        var socket = io("/" + idP);
        $("#answer").on("keyup", () => {
            var text = $("#answer").val().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/(?:\r\n|\r|\n)/g, '<br>');

            socket.emit("message", {
                message: text
            });
        });

        socket.on("message", data => {
            $("#answer").val(data.message);
            $("#answerM").html(data.message);
        });
    }
    $("#displayAccount").show();
    $("#formModifyAccount").hide();
    $("#askModInfos").click(() => {
        $("#displayAccount").hide();
        $("#formModifyAccount").show();
    });

});
