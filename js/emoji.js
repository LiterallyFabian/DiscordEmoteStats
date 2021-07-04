var data = {};

function initToastr() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "toastClass": "toastr"
    }
}

function fillDemo() {
    $.get("demo.json", function (data) {
        $("#emojidata").val(JSON.stringify(data));
    });
}

function submit() {
    initToastr();

    //check if data exists & is correct
    try {
        data = JSON.parse($("#emojidata").val())._state.usageHistory;
    } catch {
        toastr["error"]("The data could not be parsed correctly.", "Error");
        return;
    }

    generateStats();
}

function generateStats() {

}