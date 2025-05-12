export function initBarChart(svg) {

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const keys = [
        "Internet",
        "Computer",
        "Desktop or Laptop",
        "Only Smartphone"
    ];


    const x = d3.scaleBand()
        .domain(keys)
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);


    svg.append("text")
        .attr("id", "bar-title")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        // .text("Click a state to view percentages");

    // Add X axis group
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        // .attr("transform")
        .style("text-anchor", "end");


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Technology Access Categories");


    // Add Y axis group
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Percentage (%)");
      
}


export function updateBarChart(stateData, year) {
    const svg = d3.select("#barchart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const barData = [
        { label: "Internet", value: +stateData["Percent With Internet"] },
        { label: "Computer", value: +stateData["Percent With Any Computer"] },
        { label: "Desktop or Laptop", value: +stateData["Percent With Desktop or Laptop"] },
        { label: "Only Smartphone", value: +stateData["Percent Only Smartphone"] }
    ];

    const colorScale = d3.scaleOrdinal()
        .domain(barData.map(d => d.label))
        .range(["#48BFE3", "#5390D9", "#08c1ff", "#5E60CE"]);


    const x = d3.scaleBand()
        .domain(barData.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    // Update title
    svg.select("#bar-title")
        .text(`Tech Access for ${stateData.State} ${year}`);

    // Bind bars
    const bars = svg.selectAll("rect")
        .data(barData);


    console.log("barData:", barData);


    bars.join("rect")
        .attr("x", d => x(d.label))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", d => colorScale(d.label));

    // Update X axis
    svg.select(".x-axis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        // .attr("transform")
        .style("text-anchor", "end");

    // Update Y axis
    svg.select(".y-axis")
        .call(d3.axisLeft(y));
}

