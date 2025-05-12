export function initPieChart(svg) {
    
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // adjust this value if you want space between title and chart
    const chartCenterY = height+100;
    svg.append("g")
      .attr("class", "pie-group")
      .attr("transform", `translate(${width}, ${chartCenterY})`);
  
    svg.append("text")
      .attr("id", "pie-title")
      .attr("x", 150)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Click a state to view county income breakdown");
  }


  export function updatePieChart(svg, countyData, stateName) {

    
    const stateCounties = countyData.filter(c => c.State === stateName);
  
    if (stateCounties.length === 0) return;
  
    const stateIncome = +stateCounties[0]["State Median Household Income"];
  
    const categorized = {
      "Above State Avg": 0,
      "Below State Avg": 0
    };
  
    stateCounties.forEach(c => {
      const income = +c["County Median Household Income"];
      if (income > stateIncome) categorized["Above State Avg"]++;
      else categorized["Below State Avg"]++;
    });
  
    // creates actual pie data
    const pieData = Object.entries(categorized).map(([label, value]) => ({ label, value }));
  
    const radius = 130;
  
    const color = d3.scaleOrdinal()
      .domain(["Above State Avg", "Below State Avg"])
      .range(["#56CFE1", "#5E60CE"]);
  
    const pie = d3.pie().value(d => d.value);
  
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
  
    const g = svg.select(".pie-group");
  
    const arcs = pie(pieData);  // Create pie layout

    // Draw arcs
    const paths = g.selectAll("path")
      .data(arcs, d => d.data.label);
    
    paths.join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

// Add percentage labels on slices
    g.selectAll("text.pie-label")
        .data(arcs)
        .join("text")
        .attr("class", "pie-label")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "11px")
        .style("fill", "#fff")
        .text(d => {
            const total = d3.sum(pieData, d => d.value);
            const percent = (d.data.value / total * 100).toFixed(1);
            return `${percent}%`;
        });
  
    svg.select("#pie-title")
      .text(`Counties in ${stateName} Income Breakdown`);


    const legend = svg.selectAll(".pie-legend")
        .data(pieData)
        .join("g")
        .attr("class", "pie-legend")
        .attr("transform", (d, i) => `translate(10, ${180 + i * 20})`); // adjust Y

    legend.append("rect")
        .attr("x", 10)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => color(d.label));

    legend.append("text")
        .attr("x", 28)
        .attr("y", 10)
        .text(d => d.label)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    
  }
  
  