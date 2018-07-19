$(document).ready(() => {

    if (typeof idP != 'undefined') {
        var socket = io("/" + idP);
        $("#answer").on("keyup", () => {
            var text = $("#answer").val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            
            socket.emit("message", {
                message: text
            });
        });

        socket.on("message", data => {
            $("#answer").val(data.message);
        });
    }
    $("#displayAccount").show();
    $("#formModifyAccount").hide();
    $("#askModInfos").click(() => {
        $("#displayAccount").hide();
        $("#formModifyAccount").show();
    });

});
