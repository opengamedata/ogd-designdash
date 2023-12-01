// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// function HistogramVisualizer({ model, setVisualizer }) {
//   const svgRef = useRef(null);
//   var data = model.Data;

//   const svgWidth = 600; 
//   const svgHeight = 400;
//   useEffect(() => {
//     // histogram sample
//     const svg = d3.select(svgRef.current);
//     const margin = { top: 30, right: 30, bottom: 60, left: 60 }; 
//     const width = svgWidth - margin.left - margin.right;
//     const height = svgHeight - margin.top - margin.bottom;

//     const g = svg
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const x = d3.scaleLinear().domain([1, 100]).range([0, width]);

//     const bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(100))(data);

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(bins, (d) => d.length)])
//       .nice()
//       .range([height, 0]);

//     const bar = g
//       .selectAll(".bar")
//       .data(bins)
//       .enter()
//       .append("g")
//       .attr("class", "bar")
//       .attr("transform", (d) => `translate(${x(d.x0)},${y(d.length)})`);

//     bar
//       .append("rect")
//       .attr("x", 1)
//       .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
//       .attr("height", (d) => height - y(d.length))
//       .style("fill", "steelblue");

//     g
//       .append("g")
//       .attr("class", "axis")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x));

//     // Add x-axis label
//     g
//       .append("text")
//       .attr("x", width / 2)
//       .attr("y", height + 40)
//       .style("text-anchor", "middle")
//       .text("Number");

//     g
//       .append("g")
//       .attr("class", "axis")
//       .call(d3.axisLeft(y));

//     // Add y-axis label
//     g
//       .append("text")
//       .attr("x", -15)
//       .attr("y", -30)
//       .style("text-anchor", "middle")
//       .attr("transform", "rotate(-90)")
//       .text("Frequency");

//     // Add title to the visualization
//     svg
//       .append("text")
//       .attr("x", svgWidth / 2)
//       .attr("y", margin.top - 10)
//       .attr("text-anchor", "middle")
//       .style("font-size", "16px")
//       .text("The Frequency of 1000 Random Values from 1 to 100");
//   }, []);

//   return (
//     <div>
//       <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
//     </div>
//   );
// }

// export default HistogramVisualizer;



import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


function HistogramVisualizer({ model, setVisualizer }) {
  const svgRef = useRef(null);
  var data = model.Data;

  const svgWidth = 600;
  const svgHeight = 400;
  useEffect(() => {
    // scatter plot sample
    const svg = d3.select(svgRef.current);
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([1, 100]).range([0, width]);

    const frequencyData = d3.rollup(
      data,
      (v) => v.length,
      (d) => d
    );

    const y = d3
      .scaleLinear()
      .domain([0, d3.max([...frequencyData.values()])])
      .nice()
      .range([height, 0]);

    const scatterPoints = g
      .selectAll(".point")
      .data([...frequencyData])
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", 2)
      .style("fill", "steelblue");

    g
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .style("text-anchor", "middle")
      .text("Number");

    g
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    g
      .append("text")
      .attr("x", -15)
      .attr("y", -30)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Frequency");

    svg
      .append("text")
      .attr("x", svgWidth / 2)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("The Frequency of 1000 Random Values from 1 to 100");
  }, []);

  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
    </div>
  );
}

export default HistogramVisualizer;
