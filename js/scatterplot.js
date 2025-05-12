export function initScatter(svg, year, us, data, color, updateBarChart) {


    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = {top: 20, right: 30, bottom: 40, left: 50};

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => +d["Median Household Income"]))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([70, 100])
      .range([height - margin.bottom, margin.top]);


      // X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("$,")).ticks(5));

      // Y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(5));

    const validData = data.filter(d => d["Graduation Percent"] !== "");

    svg.selectAll("circle")
        .data(validData)
        .join("circle")
        .attr("cx", d => x(+d["Median Household Income"]))
        .attr("cy", d => y(+d["Graduation Percent"]))
        .attr("r", 5)
        .attr("fill", d => color(+d["Median Household Income"]))
        .append("title")
        .text(d => d.State);


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text(`Median Income vs. Graduation Rate for ${year}`);

    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Median Household Income");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Graduation Rate (%)");



}



export function initScatters(svg, year, data, stateColor) {

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = {top: 20, right: 30, bottom: 40, left: 50};

    // const scatterSvg = d3.select("#scatterplot")
    //     .attr("width", width)
    //     .attr("height", height);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => +d["Median Household Income"]))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([70, 100])
      .range([height - margin.bottom, margin.top]);


      // X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("$,")).ticks(5));

      // Y-axis
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(5));

    // console.log("Column names:", Object.keys(data[0]));
    // console.log("again", Object.keys(data[1]));


    const validData = data.filter(d => d["Graduation Percent"] !== "");


    svg.selectAll("circle")
        .data(validData)
        .join("circle")
        .attr("cx", d => x(+d["Median Household Income"]))
        .attr("cy", d => y(+d["Graduation Percent"]))
        .attr("r", 5)
        .attr("fill", d => stateColor(d.State))
        .append("title")
        .text(d => d.State);


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`Median Income vs. Graduation Rate for ${year}`);

    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Median Household Income");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Graduation Rate (%)");
}

export function highlightScatter(svg, stateName, color) {
    svg.selectAll("circle")
    .attr("fill", d => d.State === stateName ? "#4866ff" : color(+d["Median Household Income"]))
    .attr("r", d => d.State === stateName ? 8 : 5);
}
