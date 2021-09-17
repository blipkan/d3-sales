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
            key,
            cost,
            date
        };
        let v = map.get(date.getTime());
        if (v) {
            v.totalCost += cost;
            v.values.push(o)

        } else {
            const values = [];
            values.push(o);
            v = {date, totalCost: cost, values};
            map.set(date.getTime(), v)
        }
    });

    return [...map.values()]
}

/** render */
function show(model, selHolder) {
    console.info("show cluster chart", model);

    const keys = model.keys,
        data = prepareData(model);
    //console.log("values", data);
    //console.log("keys", keys);


    const x0 = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand();

    const y = d3.scaleLinear()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .range([d3.color("aquamarine"), "darkcyan"]);


    const xAxis = d3.axisBottom()
        .scale(x0)
        .tickSizeOuter(0)
        .tickFormat(u.formatTime);

    const yAxis = d3.axisLeft()
        .scale(y)
        .tickSizeOuter(0)
        .tickFormat(u.formatCost);


    const svg = getSvgRoot(selHolder);

    x0.domain(data.map(d => d.date));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function (categorie) {
        return d3.max(categorie.values, function (d) {
            return d.cost;
        });
    })]);

    u.addAxises(svg, xAxis, yAxis, height);
    svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

    const slice = svg.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) {
            return "translate(" + x0(d.date) + ",0)";
        });

    slice.selectAll("rect")
        .data(function (d) {
            return d.values;
        })
        .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function (d) {
            return x1(d.key);
        })
        .style("fill", function (d) {
            return color(d.key)
        })
        .attr("y", function () {
            return y(0);
        })
        .attr("height", function () {
            return height - y(0);
        })
        .attr("class", "bar")
        .attr("data-date", d => u.formatTime(d.date))
        .attr("data-key", d => d.key)
        .attr("data-cost", d => d.cost)
        .on("mouseover", function (d) {
            d3.select(this).style("fill", d3.rgb(color(d.key)).darker(2));
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", color(d.key));
        });

    $('.bar').on("mouseover", function (e) {
        Tooltip.show(e)
    })
        .on("mouseout", function () {
            Tooltip.hide()
        })
        .on("mousemove", function (e) {
            Tooltip.move(e)
        });


    slice.selectAll("rect")
        .transition()
        .delay(function () {
            return Math.random() * 1000;
        })
        .duration(800)
        .attr("y", function (d) {
            return y(d.cost);
        })
        .attr("height", function (d) {
            return height - y(d.cost);
        });

    //Legend
    const legend = u.addLegend(svg, keys, color, width);
    legend.transition().duration(400).delay(function (d, i) {
        return 1300 + 100 * i;
    }).style("opacity", "1");
}


function getSvgRoot(selHolder) {

    /*temporaly do not hold the svg instance*/
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


const Clusterbar = {
    show
};
export {Clusterbar};
