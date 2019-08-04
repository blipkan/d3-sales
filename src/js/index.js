import {u} from "./u.js";
import {Stackbar} from "./Stackbar.js";
import {Clusterbar} from "./Clusterbar.js";
import {Pie} from "./Pie.js";

const JSON_URL = './data/data.json',

    charts = {
        pie: Pie,
        stack: Stackbar,
        cluster: Clusterbar
    },
    chartNames = {
        pie: "Pie",
        stack: "Stackbar",
        cluster: "Clusterbar"
    };

$(init);

/* init menu icon buttons*/
function initMenu() {
    const $btns = $(".switch");
    const $charts = $(".chart");
    $btns.on("click", function (e) {
        $btns.removeClass("act");
        $charts.hide();
        const $btn = $(this),
            chartId = $btn.data("chart")
        ;
        $btn.addClass("act");
        showChart(chartId);
    })
}

/** enter function */
function init() {
    console.info("init charts app..");
    initMenu()
}

/** adopt json data*/
function createModel(jsonArr) {
    const keySet = new Set();
    const data = jsonArr.map(d => {
        const key = d['Cloud Provider'];
        keySet.add(key);
        return {
            date: u.parseTime(d['Date']),
            key,
            cost: parseFloat(d['Cost8'])
        }
    });
    return {
        data,
        keys: [...keySet]
    }
}

/** show 'chart' div and render corresponding chart*/
function showChart(chartId) {
    //console.info('loading data ...', JSON_URL);
    const selHolder = `#${chartId}`;
    $('.toolbar_chart-name').html(chartNames[chartId]);
    $(selHolder).show();
    d3.json(JSON_URL).then(jsonArr => {
            charts[chartId].show(createModel(jsonArr), selHolder);
        }, err => {
            console.error("cannot fetch data:", JSON_URL, err)
        }
    )
}





