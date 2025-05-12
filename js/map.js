import { updatePieChart } from "./piechart.js";

export function initMap(svg, year, us, data, color, highlightScatter, updateBarChart, countyData, svgPie) {
    
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = {top: 20, right: 30, bottom: 40, left: 50};

    const projection = d3.geoAlbersUsa()
        .translate([width , height / 2])
        .scale(1100);

    const path = d3.geoPath().projection(projection);
    const states = topojson.feature(us, us.objects.states).features;
    const dataByState = new Map(data.map(d => [d.State, +d["Median Household Income"]]));


    svg.selectAll("path")
        .data(states)
        .join("path")
        .attr("class", "state")
        .attr("d", path)
        .attr("fill", d => {
        const income = dataByState.get(d.properties.name);
        return income != null ? color(income) : "#ccc";
        })
        .attr("stroke", "#fff")
        .attr("data-state", d => d.properties.name)
        .on("click", (event, d) => {

        const stateName = d.properties.name;
        const stateData = data.find(row => row.State === stateName);

        if (!stateData) {
            alert(`No data found for ${stateName}`);
            return;
        }

        if (stateData["Graduation Percent"] === "") {
            alert(`Graduation data is missing for ${stateName}`);
            updateBarChart(stateData, year);
            updatePieChart(svgPie, countyData, stateName)
        } else {
            highlightScatter(stateName, color);
            updateBarChart(stateData, year);
            updatePieChart(svgPie, countyData, stateName)
        }
        })
        .on("mouseover", function(event, d) {
            const stateName = d.properties.name;
            const stateData = data.find(row => row.State === stateName);
          
            let tooltipText = `<strong>${stateName}</strong><br>`;
            tooltipText += `Income: $${(+stateData["Median Household Income"]).toLocaleString()}<br>`;
          
            if (stateData["Graduation Percent"] !== "" && stateData["Graduation Percent"] !== undefined) {
              tooltipText += `Grad Rate: ${stateData["Graduation Percent"]}%`;
            } else {
              tooltipText += `Grad Rate: N/A`;
            }
          
            d3.select("#tooltip")
              .style("display", "block")
              .html(tooltipText)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mousemove", function(event) {
            d3.select("#tooltip")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
          })        

    svg.append("text")
        .attr("x", width)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text(`U.S. Map by Median Household Income for ${year}`);

    svg.append("text")
        .attr("x", width)
        .attr("y", 40)  
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#555")
        .text("Click on a state to learn more");



    const legendWidth = 300;
    const legendHeight = 10;
    
    const legendSvg = svg.append("g")
        .attr("transform", `translate(${(width - legendWidth) / 2}, ${height - 30})`);  // positioned near bottom
    
    const legendScale = d3.scaleLinear()
        .domain(color.domain())
        .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d3.format("$,.0f"));
    
    legendSvg.selectAll("rect")
        .data(color.range().map(d => {
        const r = color.invertExtent(d);
        if (!r[0]) r[0] = legendScale.domain()[0];
        if (!r[1]) r[1] = legendScale.domain()[1];
        return r;
        }))
        .join("rect")
        .attr("x", d => legendScale(d[0]))
        .attr("y", 0)
        .attr("width", d => legendScale(d[1]) - legendScale(d[0]))
        .attr("height", legendHeight)
        .attr("fill", d => color(d[0]));
    
    legendSvg.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis);

    legendSvg.append("text")
        .attr("x", legendWidth / 2)
        .attr("y", legendHeight + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Median Household Income");
      
        
}




export function initMaps(svg, year, us, data, color) {

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = {top: 20, right: 30, bottom: 40, left: 50};

    const projection = d3.geoAlbersUsa()
        .translate([width/2, height/2])
        .scale(550);

    const path = d3.geoPath().projection(projection);
    const states = topojson.feature(us, us.objects.states).features;
    const dataByState = new Map(data.map(d => [d.State, +d["Median Household Income"]]));


    svg.selectAll("path")
        .data(states)
        .join("path")
        .attr("class", "state")
        .attr("d", path)
        .attr("fill", d => {
        const income = dataByState.get(d.properties.name);
        return income != null ? color(income) : "#ccc";
        })
        .attr("stroke", "#fff")
        .attr("data-state", d => d.properties.name)
        .on("mouseover", function(event, d) {
            const stateName = d.properties.name;
            const stateData = data.find(row => row.State === stateName);
          
            let tooltipText = `<strong>${stateName}</strong><br>`;
            tooltipText += `Income: $${(+stateData["Median Household Income"]).toLocaleString()}<br>`;
          
            if (stateData["Graduation Percent"] !== "" && stateData["Graduation Percent"] !== undefined) {
              tooltipText += `Grad Rate: ${stateData["Graduation Percent"]}%`;
            } else {
              tooltipText += `Grad Rate: N/A`;
            }
          
            d3.select("#tooltip")
              .style("display", "block")
              .html(tooltipText)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mousemove", function(event) {
            d3.select("#tooltip")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function() {
            d3.select("#tooltip").style("display", "none");
          })

    svg.append("text")
        .attr("x", width/2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(`U.S. Map by Median Household Income for ${year}`);

    svg.append("text")
        .attr("x", width/2)
        .attr("y", 40)  
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#555")
        .text("Click on a state to learn more");



    const legendWidth = 300;
    const legendHeight = 10;
    
    const legendSvg = svg.append("g")
        .attr("transform", `translate(${(width - legendWidth) / 2}, ${height - 30})`);  // positioned near bottom
    
    const legendScale = d3.scaleLinear()
        .domain(color.domain())
        .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d3.format("$,.0f"));
    
    legendSvg.selectAll("rect")
        .data(color.range().map(d => {
        const r = color.invertExtent(d);
        if (!r[0]) r[0] = legendScale.domain()[0];
        if (!r[1]) r[1] = legendScale.domain()[1];
        return r;
        }))
        .join("rect")
        .attr("x", d => legendScale(d[0]))
        .attr("y", 0)
        .attr("width", d => legendScale(d[1]) - legendScale(d[0]))
        .attr("height", legendHeight)
        .attr("fill", d => color(d[0]));
    
    legendSvg.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis);

    legendSvg.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", legendHeight + 30)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Median Household Income");
      
        
}




  
  