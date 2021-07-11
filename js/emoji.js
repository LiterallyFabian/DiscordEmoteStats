var data = {};
var sortedData = [];
var totalEmoji = 0;
var totalCustom = 0;

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
    for (var key in data) {
        sortedData.push({
            key: key,
            totalUses: data[key].totalUses,
            score: data[key].score
        })
        totalEmoji++;
        if (!isNaN(parseInt(key))) totalCustom++;
    }
    sortedData.sort((a, b) => (a.totalUses < b.totalUses) ? 1 : -1)
    generateStats();
    $("#dataentry").css("display", "none");
}

function generateStats() {

    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);
}


function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Type', 'Count'],
        ['Official', totalEmoji - totalCustom],
        ['Custom', totalCustom]
    ]);

    var options = {
        title: 'Total official vs custom emojis used',
        slices: {
            0: {
                color: "#7289DA"
            },
            1: {
                color: "#9CB0F8"
            }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}