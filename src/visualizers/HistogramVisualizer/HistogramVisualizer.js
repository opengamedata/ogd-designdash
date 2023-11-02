import React, { useEffect, useRef } from "react";
import * as d3 from "d3"; // Import D3.js

function HistogramVisualizer({model, setVisualizer}) {
  const svgRef = useRef(null);
  var data = model.Data;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgWidth = 800; // Adjusted for more bars
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([1, 100]).range([0, width]);

    const bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(100))(
      data
    );

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([height, 0]);

    const bar = g
      .selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d) => `translate(${x(d.x0)},${y(d.length)})`);

    bar
      .append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", (d) => height - y(d.length))
      .style("fill", "blue"); // Set the bar color to blue

    bar
      .append("text")
      .attr("dy", ".75em")
      .attr("y", -12)
      .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .text((d) => d.length);

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g").attr("class", "axis").call(d3.axisLeft(y));
  }, []); // Empty dependency array to ensure the effect runs once

  return (
    <div>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
}

export default HistogramVisualizer;
