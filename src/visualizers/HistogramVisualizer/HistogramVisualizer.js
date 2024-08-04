import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function HistogramVisualizer({ model, setVisualizer }) {
  const svgRef = useRef(null);
  var data = model.Data;

  const svgWidth = 450;
  const svgHeight = 400;
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([1, 100]).range([0, width]);
    const bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(100))(data);
    const y = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).nice().range([height, 0]);

    const bar = g.selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`);

    bar.append("rect")
      .attr("x", 1)
      .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
      .attr("height", d => height - y(d.length))
      .attr("fill", "#69b3a2");

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // X-axis Title
    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
      .style("text-anchor", "middle")
      .text("Number");

    g.append("g")
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


export default HistogramVisualizer;