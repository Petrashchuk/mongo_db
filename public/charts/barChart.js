function createBarChart(inputData, gender, answer) {
    const fieldKey = Object.keys(inputData[0])[0];
    const fieldValue = 'count';
    const margin = ({top: 20, right: 0, bottom: 30, left: 40});

    var width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    let maxValue = d3.max(inputData.map(d => d[fieldValue]));

    x.domain(inputData.map(d => d[fieldKey]));
    y.domain([0, maxValue]);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(inputData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "steelblue")
        .attr("x", function (d) {
            return x(d[fieldKey]);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d[fieldValue]);
        })
        .attr("height", function (d) {
            return height - y(d[fieldValue]);
        })
        .on("mousemove", function (d) {
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "block")
                .html((d[fieldKey]) + "<br>" + (d[fieldValue]));
        })
        .on("mouseout", function (d) {
            tooltip.style("display", "none");
        });

    svg.append('text')
        .text(answer.toUpperCase() + ' : ' + gender.toUpperCase() + ' : ' + fieldKey)
        .attr('x', () => (width / 2) - 70)
        .attr('y', -8)
        .attr('font-family', 'Segoe UI')
        .attr('font-weight', 'bold')
        .attr('font-size','1.1em');
}
