function createPie(inputData) {

    let noTotal = inputData.no.map(sex => sex.count).reduce((tot, cur) => tot + cur, 0);
    let yesTotal = inputData.yes.map(sex => sex.count).reduce((tot, cur) => tot + cur, 0);
    let data = [{yes: yesTotal}, {no: noTotal}];
    data = data.map(item => {
        return {
            name: Object.keys(item)[0],
            value: item[Object.keys(item)[0]]
        }
    });

    let width = 450;
    let height = 450;
    let margin = 40;

    let radius = Math.min(width, height) / 2 - margin;

    const arcLabel = () => {
        const radius = Math.min(width, height) / 2 * 0.8;
        return d3.arc().innerRadius(radius).outerRadius(radius);
    };

    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    const arcs = pie(data);

    const color = d3.scaleOrdinal()
        .domain(data)
        .range(["#ff0000", "#01be0e"]);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1);

    const svg = d3.select("#pie")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    svg.append("g")
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 22)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel().centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name.toUpperCase()))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));
    return svg.node();

}
