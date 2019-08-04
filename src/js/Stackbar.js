import {u} from "./u.js";
import {Tooltip} from "./Tooltip.js";

const margin = {top: 20, right: 160, bottom: 100, left: 160},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svgRoot;

function prepareData(model) {
    const map = new Map();
    model.data.forEach(d => {
        const date = d.date,
            key = d.key,
            cost = d.cost
        ;
        const o = {
            date
        };
        o[key] = cost;
        let v = map.get(date.getTime());
        if (v) {
            v.totalCost += cost;
        } else {
            v = {date, totalCost: cost};
            map.set(date.getTime(), v)
        }
        v[key] = cost;
    });
    return [...map.values()]
}

///TODO: animation
/** render */
function show(model, selHolder) {
    console.info("show stackbar chart", model);
    const keys = model.keys,
        values = prepareData(model);

    /*
        console.log("values", values);
        console.log("keys", keys);
    */

    const stack = d3.stack()
        .keys(keys)
        .value((d, key) => d[key] || 0);

    const dataset = stack(values);
    //console.log("dataset", dataset);

    const x = d3.scaleBand()
        .domain(values.map(o => o.date.getTime()))
        .range([0, width]).round(true).padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d3.max(d, arr => arr[1]))])
        .range([height, 0]);

    // colors
    const color = d3.scaleOrdinal()
        .range([d3.color("aquamarine"), "darkcyan"]);


    const xAxis = d3.axisBottom()
        .scale(x)
        .tickSizeOuter(0)
        .tickFormat(u.formatTime);

    const yAxis = d3.axisLeft()
        .scale(y)
        .tickSizeOuter(0)
        .tickFormat(u.formatCost);

    const svg = getSvgRoot(selHolder);

    svg.append("g")
        .selectAll("g")
        .data(dataset)
        .enter().append("g")
        .attr("fill", function (d) {
            return color(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.data.date.getTime());
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .attr("class", "bar")
        .attr("data-date", d => u.formatTime(d.data.date))
        .attr("data-cost", d => {

            return d.data.totalCost
        }).attr("data-key", d => {
        //TODO:
        //return d.key
        return "Azure"
    });

    $('.bar').on("mouseover", function (e) {
        Tooltip.show(e)
    })
        .on("mouseout", function (e) {
            Tooltip.hide()
        })
        .on("mousemove", function (e) {
            Tooltip.move(e)
        });

    u.addAxises(svg, xAxis, yAxis, height);
    svg.select('.y').transition().duration(400).delay(100).style('opacity', '1');

    const legend = u.addLegend(svg, keys, color, width);
    legend.transition().duration(200).delay(function (d, i) {
        return 100 + 100 * i;
    }).style("opacity", "1");
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
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}


const Stackbar = {
    show
};
export {Stackbar};
