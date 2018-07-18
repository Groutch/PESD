$(document).ready(() => {
    var socket = io();
    $("#displayAccount").show();
    $("#formModifyAccount").hide();
    $("#askModInfos").click(() => {
        $("#displayAccount").hide();
        $("#formModifyAccount").show();
    });
    $("#answer").on("keyup", () => {
        var text = $("#answer").val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        socket.emit("message", {
            message: text
        });
    });
    socket.on("message", function (data) {
        $("#answer").val(data.message);
    });
});
