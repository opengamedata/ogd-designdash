import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


function BarplotVisualizer({ model, setVisualizer }) {
  const svgRef = useRef();
  const dict = { "level1": 100, "level2": 40, "level3": 20, "level4": 10, "level5": 5, "level6": 3 };

  const svgWidth = 600;
  const svgHeight = 400;
  useEffect(() => {
    // Convert dictionary to array format
    const data = Object.entries(dict).map(([category, value]) => ({ category, value }));

    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = 450 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear the previous contents
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.category))
      .padding(0.2);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "#69b3a2");
  }, []);

  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
    </div>
  );
}

export default BarplotVisualizer;
