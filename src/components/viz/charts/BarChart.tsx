import React, { useState, useEffect, useRef } from 'react';
import useDataStore from '../../../store/useDataStore';
import * as d3 from 'd3';
import Select from '../../layout/Select';

interface BarChartProps {
  gameDataId: string;
}

export const BarChart: React.FC<BarChartProps> = ({ gameDataId }) => {
  const { getDatasetByID } = useDataStore();
  const dataset = getDatasetByID(gameDataId);
  const [feature, setFeature] = useState<string>('');
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  if (!dataset) {
    return <div>Dataset not found</div>;
  }
  const { data } = dataset;

  // Resize observer to handle container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      !feature ||
      !svgRef.current ||
      !data.length ||
      dimensions.width === 0 ||
      dimensions.height === 0
    )
      return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Get unique values and their counts for the selected feature
    const valueCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => d[feature as keyof typeof d],
    );

    const chartData = Array.from(valueCounts.entries()).map(
      ([value, count]) => ({
        value: String(value),
        count,
      }),
    );

    // Sort by count descending
    chartData.sort((a, b) => b.count - a.count);

    // Chart dimensions with responsive margins
    const margin = {
      top: Math.max(20, dimensions.height * 0.05),
      right: Math.max(20, dimensions.width * 0.03),
      bottom: Math.max(60, dimensions.height * 0.15),
      left: Math.max(60, dimensions.width * 0.1),
    };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Set SVG dimensions to fill container
    d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const svg = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale (categorical)
    const xScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.value))
      .range([0, width])
      .padding(0.1);

    // Y scale (linear)
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.count) || 0])
      .range([height, 0]);

    // Add bars
    svg
      .selectAll('.bar')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.value) || 0)
      .attr('y', (d) => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.count))
      .attr('fill', '#3b82f6')
      .attr('rx', 2);

    // Add bar labels (only if there's enough space)
    if (chartData.length <= 20) {
      // Limit labels to prevent overcrowding
      svg
        .selectAll('.bar-label')
        .data(chartData)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', (d) => (xScale(d.value) || 0) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d.count) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', Math.max(10, Math.min(12, height / 30)))
        .attr('fill', '#374151')
        .text((d) => d.count);
    }

    // Add X axis
    const xAxis = d3.axisBottom(xScale);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-30)')
      .style('text-anchor', 'end')
      .attr('font-size', Math.max(10, Math.min(12, width / 50)));

    // Add Y axis
    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .call(yAxis)
      .attr('font-size', Math.max(10, Math.min(12, height / 30)));

    // Add axis labels
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-size', Math.max(12, Math.min(14, height / 25)))
      .attr('fill', '#374151')
      .text('Count');

    svg
      .append('text')
      .attr(
        'transform',
        `translate(${width / 2}, ${height + margin.bottom - 10})`,
      )
      .style('text-anchor', 'middle')
      .attr('font-size', Math.max(12, Math.min(14, height / 25)))
      .attr('fill', '#374151')
      .text(feature);

    // Add title
    // svg
    //   .append('text')
    //   .attr('x', width / 2)
    //   .attr('y', 0 - margin.top / 2)
    //   .attr('text-anchor', 'middle')
    //   .attr('font-size', Math.max(14, Math.min(16, height / 20)))
    //   .attr('font-weight', 'bold')
    //   .attr('fill', '#111827')
    //   .text(`Distribution of ${feature}`);
  }, [feature, data, dimensions]);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Select
        label="Feature"
        value={feature}
        onChange={(value) => setFeature(value)}
        options={data.columns}
      />

      <div ref={containerRef} className="flex-1 min-h-0">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ minHeight: '200px' }}
        ></svg>
      </div>
    </div>
  );
};
