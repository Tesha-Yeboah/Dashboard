import { initMap } from './map.js';
import { highlightScatter, initScatter } from './scatterplot.js';
import { initBarChart, updateBarChart } from './barchart.js';
import { initPieChart, updatePieChart } from './piechart.js';

function loadDashboard(year) {
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
  d3.csv(`data/state_tech_income_${year}.csv`),
  d3.csv(`data/county_state_income_${year}.csv`)
]).then(([us, data, countyData]) => {



    const svgMap = d3.select("#map").attr("width", 500).attr("height", 610);
    const svgScatter = d3.select("#scatterplot").attr("width", 500).attr("height", 500);
    const svgBar = d3.select("#barchart").attr("width", 500).attr("height", 500);
    const svgPie = d3.select("#pie").attr("width", 500).attr("height", 100);

    clearSvg(svgMap);
    clearSvg(svgScatter);
    clearSvg(svgBar);
    clearSvg(svgPie);

    const color = d3.scaleQuantize()
        .domain(d3.extent(data, d => +d["Median Household Income"]))
        .range(d3.schemeBlues[9]);

    initMap(svgMap, year, us, data, color, 
        (stateName) => highlightScatter(svgScatter, stateName, color), 
        (stateData) => updateBarChart(stateData, year),
        countyData, svgPie
    );

    initScatter(svgScatter, year, us, data, color, 
        (stateData) => updateBarChart(stateData, year));

    initBarChart(svgBar);

    initPieChart(svgPie)

});
}

// Initial load
loadDashboard("2021");

// Handle year change
document.getElementById("year-select").addEventListener("change", e => {
  const selectedYear = e.target.value;
  loadDashboard(selectedYear);
});

function clearSvg(svg) {
    svg.selectAll("*").remove();
  }
  


