import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


function ScatterplotVisualizer({ model, setVisualizer }) {
  const svgRef = useRef(null);
  var data = model.Data;

  const svgWidth = 450;
  const svgHeight = 400;
  useEffect(() => {
    // scatter plot sample
    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
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
      .style("fill", "#69b3a2");

    g
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
      .style("text-anchor", "middle")
      .text("Number");

    g
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Y-axis Title
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Frequency");

    // Main Title
    svg.append("text")
      .attr("x", svgWidth / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Frequency of 1000 Random Values");
  }, []);

  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
    </div>
  );
}

export default ScatterplotVisualizer;
