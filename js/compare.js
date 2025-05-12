import { initMaps } from './map.js';
import { initScatters } from './scatterplot.js';

document.getElementById("compare-mode").addEventListener("change", (e) => {
  const mode = e.target.value;

  document.querySelectorAll(".compare-view").forEach(div => div.style.display = "none");

  if (mode === "maps") {
    document.getElementById("map-compare-container").style.display = "flex";
    loadMapComparison();
  } else if (mode === "scatterplots") {
    document.getElementById("scatter-compare-container").style.display = "flex";
    loadScatterComparison();
  }
});

function loadMapComparison() {
  Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
    d3.csv("data/state_tech_income_2020.csv"),
    d3.csv("data/state_tech_income_2021.csv"),
    d3.csv("data/state_tech_income_2022.csv")
  ]).then(([us, data2020, data2021, data2022]) => {

    const color2020 = d3.scaleQuantize()
      .domain(d3.extent(data2020, d => +d["Median Household Income"]))
      .range(d3.schemeBlues[9]);

    const color2021 = d3.scaleQuantize()
      .domain(d3.extent(data2021, d => +d["Median Household Income"]))
      .range(d3.schemeBlues[9]);

    const color2022 = d3.scaleQuantize()
        .domain(d3.extent(data2022, d => +d["Median Household Income"]))
        .range(d3.schemeBlues[9]);

    const svgLeft = d3.select("#map-left");
    const svgMiddle = d3.select("#map-middle")
    const svgRight = d3.select("#map-right");

    svgLeft.selectAll("*").remove();
    svgMiddle.selectAll("*").remove();
    svgRight.selectAll("*").remove();

    initMaps(svgLeft, "2020", us, data2020, color2020);
    initMaps(svgMiddle, "2021", us, data2021, color2021);
    initMaps(svgRight, "2022", us, data2022, color2022);
  });
}

function loadScatterComparison() {
  Promise.all([
    d3.csv("data/state_tech_income_2020.csv"),
    d3.csv("data/state_tech_income_2021.csv"),
    d3.csv("data/state_tech_income_2022.csv")
  ]).then(([data2020, data2021, data2022]) => {

    // Get all unique state names
    const allStates = [...new Set([...data2020, ...data2021, ...data2022].map(d => d.State))];

    const myCustomColorList = [
        "#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231",
        "#911eb4", "#46f0f0", "#f032e6", "#d2f53c", "#fabebe",
        "#008080", "#e6beff", "#aa6e28", "#fffac8", "#800000",
        "#aaffc3", "#808000", "#ffd8b1", "#000080", "#808080",
        "#FFFFFF", "#000000", "#ff4500", "#32cd32", "#ff69b4",
        "#1e90ff", "#ffb6c1", "#00fa9a", "#8a2be2", "#7fff00",
        "#dc143c", "#00ced1", "#ff6347", "#2e8b57", "#d2691e",
        "#4b0082", "#ff1493", "#00ff7f", "#4682b4", "#da70d6",
        "#7cfc00", "#20b2aa", "#db7093", "#556b2f", "#8b0000",
        "#ffdead", "#b0e0e6", "#ff8c00", "#6a5acd", "#fa8072"
      ];
      

    const stateColor = d3.scaleOrdinal()
        .domain(allStates)
        .range(myCustomColorList); // Ensure exactly 50 colors
      

    const svgLeft = d3.select("#scatter-left");
    const svgMiddle = d3.select("#scatter-middle");
    const svgRight = d3.select("#scatter-right");

    svgLeft.selectAll("*").remove();
    svgRight.selectAll("*").remove();
    svgMiddle.selectAll("*").remove();


    initScatters(svgLeft, "2020",  data2020, stateColor);
    initScatters(svgMiddle, "2021",  data2021, stateColor);
    initScatters(svgRight, "2022",  data2022, stateColor);
  });
}
