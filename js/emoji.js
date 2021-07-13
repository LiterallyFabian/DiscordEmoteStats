var data = {};
var sortedData = [];
var uniqueEmoji = 0;
var uniqueCustom = 0;

var usedEmoji = 0;
var usedCustom = 0;

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
        uniqueEmoji++;
        usedEmoji += data[key].totalUses;
        if (isCustom(key)) {
            uniqueCustom++;
            usedCustom += data[key].totalUses;
        }
    }
    sortedData.sort((a, b) => (a.totalUses < b.totalUses) ? 1 : -1)
    generateStats();
    $("#dataentry").css("display", "none");
}
var allEmojis = {};

function generateStats() {

    $.get("emojis.json", function (data) {
        Object.values(data)[0].forEach(emoji => {
            allEmojis[emoji.shortname.replace(/:/g, "")] = emoji;
        })
        sortedData.forEach(emojiData => {
            if (isCustom(emojiData.key)) {
                //emoji is custom
                appendCard(`https://cdn.discordapp.com/emojis/${emojiData.key}.png`, emojiData.totalUses)
            } else {
                //emoji is built-in
                var emoji = allEmojis[emojiData.key];
                if (emoji) {
                    var emojiObj = $.parseHTML(twemoji.parse(emoji.emoji))[0];
                    if (emojiObj.attributes) appendCard(emojiObj.attributes.src.value, emojiData.totalUses)
                }
            }
        })

    });


    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawCharts);
}

function appendCard(link, count) {
    $("#emojiList").append(`
        <div class="col-6 col-md-3 col-lg-1 mb-4">
            <div style="padding:10px; background: linear-gradient(to right, rgba(114,137,218,0.5) ${count/usedEmoji*100}%, white ${100-count/usedEmoji*100}%);" class="card mx-auto text-center">
                <a href="#url"><img class="card-img-top" src="${link}" alt="Sample Title"></a>
                <p>HIO</p>
            </div>
        </div>
    `)
}

function drawCharts() {
    //draw total official-unique ratio
    var data = google.visualization.arrayToDataTable([
        ['Type', 'Count'],
        ['Official', usedEmoji - usedCustom],
        ['Custom', usedCustom]
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

    var chart = new google.visualization.PieChart(document.getElementById('piechart-unique'));

    chart.draw(data, options);


    //draw unique official-unique ratio
    var data = google.visualization.arrayToDataTable([
        ['Type', 'Count'],
        ['Official', uniqueEmoji - uniqueCustom],
        ['Custom', uniqueCustom]
    ]);

    var options = {
        title: 'Total unique official vs custom emojis used',
        slices: {
            0: {
                color: "#7289DA"
            },
            1: {
                color: "#9CB0F8"
            }
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart-total'));

    chart.draw(data, options);
}

function isCustom(emoji) {
    return emoji.length == 18 && !isNaN(parseInt(emoji));
}