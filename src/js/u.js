/** utils */

const u = {
    parseTime: d3.timeParse("%Y-%m-%d"),
    formatTime: d3.timeFormat("%Y-%m-%d"),
    formatCost: d3.format(".1s"),
    formatCostDollar: d3.format(","),

    formatPercent: d3.format(",.1%"),

    formatCostTip(v) {
        return u.formatCostDollar(Math.round(v)) + '$';
    },

    px(v) {
        return (v) ? v + "px" : 0;
    },

    addLegend(svg, keys, color, width) {
        const legend = svg.selectAll(".legend")
            .data(keys)
            .enter().append("g")
            .attr("class", "legend")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "start ")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("opacity", "0");

        legend.append("text")
            .attr("x", width - 19)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });

        legend.append("rect")
            .attr("x", width - 19 - 22)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", color);


        return legend
    },

    addAxises(svg, xAxis, yAxis, height) {
        svg.append("g")
            .attr("class", "x axis")

            .attr("transform", "translate(0," + height + ")")
            .call(xAxis).selectAll("text")
            .attr("transform", "translate(-20,30) rotate(-65)");

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");
    }

};


export {u};