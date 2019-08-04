import {u} from "./u.js";
import {Tooltip} from "./Tooltip.js";

const margin = {top: 20, right: 160, bottom: 100, left: 160},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svgRoot;

function prepareData(model) {
    const map = new Map();
    let total = 0;
    model.data.forEach(d => {
        const date = d.date,
            cost = d.cost;
        total += cost;
        let v = map.get(date.getTime());
        if (v) {
            v.cost += cost;

        } else {
            v = {date, cost};
            map.set(date.getTime(), v)
        }

    });

    return {total, data: [...map.values()]}
}

/** render */
function show(model, selHolder) {
    console.info("show pie chart", model);

    const plot = prepareData(model),
        data = plot.data;

    const radius = -20 + Math.min(width, height) / 2;

    const z = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#00aecd', '#984ea3']);

    const pie = d3.pie().value(function (d) {
        return d.cost;
    });

    const path = d3.arc()
        .outerRadius(radius)
        .innerRadius(0.5 * radius);

    const label = d3.arc()
        .outerRadius(radius)
        .innerRadius(0.5 * radius);

    const svg = getSvgRoot(selHolder);
    const g = svg.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    const arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
    ;

    arc.append("path")
        .attr("d", path)
        .attr("fill", function (d) {
            return z(d.data.date);
        })
        .attr("class", "sector")
        .attr("data-date", d => u.formatTime(d.data.date))
        .attr("data-key", d => '')
        .attr("data-cost", d => d.data.cost)
    ;

    arc.append("text")
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return u.formatPercent(d.data.cost / plot.total);
        });

    $('.sector').on("mouseover", function (e) {
        Tooltip.show(e)
    })
        .on("mouseout", function (e) {
            Tooltip.hide()
        })
        .on("mousemove", function (e) {
            Tooltip.move(e)
        });


    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(data.map(d => `${u.formatTime(d.date)} (${u.formatCostTip(d.cost)})`))
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("text")
        .attr("x", width - 14)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });

    legend.append("rect")
        .attr("x", width - 19 - 18)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    const center = arc.append("circle")
        .attr('r', 0.5 * radius)
        .attr('fill', 'orange');

    arc.append("text")
        .attr('class', 'total')
        .text(u.formatCostTip(plot.total));

}

function getSvgRoot(selHolder) {

    ///temporaly do not hold the svg instance
    svgRoot = null;
    $(selHolder).html('');
    if (svgRoot) {
        return svgRoot;
    }
    return svgRoot = d3.select(selHolder)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        ;
}


const Pie = {
    show
};
export {Pie};
