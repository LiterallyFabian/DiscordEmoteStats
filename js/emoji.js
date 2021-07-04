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

    //check if data exists
    try {
        data = JSON.parse($("#emojidata").val());
    } catch {
        toastr["error"]("The data could not be parsed correctly.", "Error");
        return;
    }

    //check if data is correct
    if (!data._state.usageHistory) {
        toastr["error"]("The data could be parsed but is invalid.", "Error");
        return;
    }

    generateStats();
}

function generateStats() {

}